#!/usr/bin/env bash
set -euo pipefail

archive=${1:?Missing archive}
release_id=${2:?Missing release ID}
revision=${3:?Missing revision}
deploy_root=${DEPLOY_ROOT:-/home/app}
site_origin=${SITE_ORIGIN:-https://xwtest.com.cn}
target="$deploy_root/xwtest"
backup="$deploy_root/xwtest-backups/$release_id"
stage=''
changed=false

[[ "$release_id" =~ ^[0-9]+-[0-9]+$ ]]
[[ "$revision" =~ ^[a-f0-9]{40}$ ]]
for executable in rsync tar curl; do
  command -v "$executable" >/dev/null || { echo "Missing command: $executable" >&2; exit 1; }
done
test -f "$target/index.html" || { echo "Existing site not found: $target" >&2; exit 1; }
test ! -e "$backup" || { echo "Backup already exists: $backup" >&2; exit 1; }

cleanup() {
  result=$?
  trap - EXIT
  if [[ "$result" -ne 0 && "$changed" == true ]]; then
    echo "Deployment failed; restoring frontend from $backup" >&2
    # Keep runtime data and hashed assets, including files needed by open browser tabs.
    if ! rsync -a --delay-updates --exclude=/data/ "$backup/" "$target/"; then
      echo "Automatic restore failed. Restore this backup manually: $backup" >&2
    fi
    if [[ ! -f "$backup/deploy-version.txt" ]]; then
      rm -f "$target/deploy-version.txt"
    fi
  fi
  [[ -z "$stage" ]] || rm -rf "$stage"
  exit "$result"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

stage=$(mktemp -d "$deploy_root/.xwtest-stage.XXXXXX")
tar -xzf "$archive" -C "$stage"
for page in index.html products/index.html contact/index.html; do
  test -s "$stage/$page" || { echo "Missing built page: $page" >&2; exit 1; }
done
[[ "$(cat "$stage/deploy-version.txt")" == "$revision" ]]
# Build artifacts must never supply runtime data or symlinks into the server filesystem.
test ! -e "$stage/data"
test -z "$(find "$stage" -type l -print -quit)"
find "$stage" -type d -exec chmod 755 {} +
find "$stage" -type f -exec chmod 644 {} +

mkdir -p "$backup"
rsync -a --exclude=/data/ "$target/" "$backup/"
changed=true
rsync -a --delay-updates --exclude=/data/ --exclude=/index.html "$stage/" "$target/"
cp "$stage/index.html" "$target/.index.html.deploy"
chmod 644 "$target/.index.html.deploy"
mv -f "$target/.index.html.deploy" "$target/index.html"
# Nginx must be able to read files regardless of the SSH user's umask.
chmod 755 "$target"

curl_options=(--noproxy '*' --fail --silent --show-error --location --connect-timeout 10 --max-time 30)
served_revision=$(curl "${curl_options[@]}" "$site_origin/deploy-version.txt?release=$release_id")
[[ "$served_revision" == "$revision" ]] || { echo 'Published revision does not match' >&2; exit 1; }
for route in / /products/ /contact/; do
  curl "${curl_options[@]}" --output /dev/null "$site_origin$route"
done
changed=false
echo "Published $revision. Frontend backup: $backup"
