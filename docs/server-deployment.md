# GitHub Actions 发布到 XWTEST 服务器

## 发布范围

工作流：`.github/workflows/deploy-server.yml`，在 Actions 中显示为 **Deploy to XWTEST Server**。

- 从 `main` 构建前端并上传到 `/home/app/xwtest`。
- Node 版本读取 `.nvmrc`；执行 lint、类型检查、测试和生产构建，任一步失败都不发布。
- 使用 `VITE_BASE_PATH=/`、`SITE_ORIGIN=https://xwtest.com.cn`，适配官网根路径。
- 不发布热门产品 API，不修改 PM2、Nginx 或编辑口令。
- 明确排除站点的 `data/` 目录，保留现有热门配置。发布包中不允许出现该目录。
- `Deploy to GitHub Pages` 已于 2026-11-20 在 GitHub Actions 页面手动停用，后续推送不再运行该工作流。配置文件保留，当前发布使用 `Deploy to XWTEST Server`。
- 停用工作流不会下线已发布的 Pages 站点或删除历史记录。如需恢复，可在该工作流页面点击 `Enable workflow`。

## 1. 配置仓库 Secrets

进入仓库 **Settings → Secrets and variables → Actions → Secrets → New repository secret**。

| Name | 内容 |
| --- | --- |
| `SSH_HOST` | 服务器公网 IP 或域名，不带协议，目前为 `101.133.165.254` |
| `SSH_PORT` | SSH 端口，目前为 `22` |
| `SSH_USER` | 部署用户名，目前为 `root` |
| `SSH_PRIVATE_KEY` | 已授权到服务器的部署私钥全文，包括首尾标记 |
| `SSH_KNOWN_HOSTS` | 下方步骤获取的服务器 SSH 主机公钥记录 |

每项单独保存，Secret 内容不要带 `名称=`。这些值均不会写入前端构建产物。

### 补充 SSH_KNOWN_HOSTS

在已确认连接正确服务器的 **Termius → XWTEST** 终端执行：

```bash
printf '%s ' '101.133.165.254'
cut -d ' ' -f 1,2 /etc/ssh/ssh_host_ed25519_key.pub
```

把合并输出的一整行存入 `SSH_KNOWN_HOSTS`，形式如下：

```text
101.133.165.254 ssh-ed25519 AAAA...服务器实际公钥...
```

这里读取的是服务器的主机公钥，不是部署私钥。工作流严格验证主机身份，不会自动信任扫描到的未知主机密钥。

若改用域名，第一段需与 `SSH_HOST` 一致；端口不是 22 时第一段写成 `[主机]:端口`。服务器重装导致主机密钥变化时，先通过 Termius 核对新公钥，再更新此 Secret。

## 2. 检查服务器依赖

在服务器执行：

```bash
command -v bash rsync tar curl
test -f /home/app/xwtest/index.html && echo '站点目录存在'
```

需具备 `bash`、`rsync`、`tar`、`curl`。如果缺少 rsync，在当前支持 dnf 的服务器安装：

```bash
dnf install -y rsync
```

部署用户需要读写 `/home/app/xwtest`，以及创建 `/home/app/xwtest-deploy` 和 `/home/app/xwtest-backups` 的权限。SSH 端口也需要允许 GitHub 托管 runner 连接；若使用固定来源 IP 限制，应另行配置固定出口 runner。

## 3. 首次手动发布

1. 将新增工作流、发布脚本、测试和文档提交并推送到仓库的 `main` 分支。
2. 打开 GitHub 仓库 **Actions → Deploy to XWTEST Server**。
3. 点击 **Run workflow**，分支选择 `main`，再点击绿色的 **Run workflow**。
4. 查看本次运行的各步骤，全部绿色代表构建、上传及线上检查通过。
5. 打开官网首页、产品页和联系页，检查展示与交互。自动 HTTP 检查不能代替视觉验收。

工作流仅允许 `main` 发布。首次上线前默认只允许手动触发；推送事件对应的服务器发布任务会显示 skipped。

## 4. 开启后续自动发布

首次手动发布验证通过后，进入 **Settings → Secrets and variables → Actions → Variables**，点击 **New repository variable**：

| Name | Value |
| --- | --- |
| `AUTO_DEPLOY_SERVER` | `true` |

注意这是 **Variables** 页签，不是 Secrets。之后每次推送到 `main` 都会发布到服务器。删除该变量或改为 `false` 可停用自动发布，仍可手动运行。

## 备份、检查与恢复

- 每次先备份旧前端到 `/home/app/xwtest-backups/<运行ID>-<尝试次数>/`，备份排除运行时 `data/`。
- 上传文件放在 `/home/app/xwtest-deploy/<运行ID>-<尝试次数>/`。
- 上传新文件后最后替换首页入口；保留旧资源，避免已打开页面加载旧文件时出现 404。不使用 `rsync --delete`。
- 验证公网 `https://xwtest.com.cn/deploy-version.txt` 与本次提交 SHA 一致，再检查 `/`、`/products/`、`/contact/` 的 HTTP 响应。
- 检查失败时自动恢复备份中的前端文件，Actions 保持失败状态。额外的新资源文件保留，热门数据不回滚。
- 这是原目录内的发布，不是整个目录的原子切换；更新期间可能短暂出现新旧静态页面混合。GitHub 同一工作流的发布串行执行，不强制取消进行中的发布。
- 若 SSH 断线或进程被强制终止，检查日志及站点状态，必要时手动恢复。尚未验证的发布不可视为成功。

手动恢复时，将下面的目录换成日志中真实的备份路径：

```bash
rsync -a --delay-updates --exclude=/data/ \
  /home/app/xwtest-backups/运行ID-尝试次数/ \
  /home/app/xwtest/
```

首次发布前的旧站可能没有 `deploy-version.txt`；恢复此类备份后，可删除站点中由新发布生成的该标记文件。备份与上传包不会自动清理，确认无需回滚后再定期清理旧运行目录，避免磁盘持续增长。

## 常见失败

| 日志或现象 | 检查方式 |
| --- | --- |
| Missing repository secret | 补齐对应的仓库 Secret，检查名称与大小写 |
| Host key verification failed | 核对 `SSH_KNOWN_HOSTS` 的主机、端口与公钥 |
| Permission denied (publickey) | 核对用户名、私钥全文、服务器 authorized_keys 中的公钥 |
| SSH 连接超时 | 检查 SSH 端口、安全组、防火墙及来源 IP 限制 |
| Missing command: rsync | 在服务器安装 rsync 后重新运行 |
| Published revision does not match | 检查域名解析、Nginx root、CDN 缓存；版本文件应指向本次发布目录 |
| HTTPS 检查失败 | 检查域名证书与服务器访问官网的网络；工作流不会跳过证书校验 |
| 自动发布被跳过 | 确认分支为 main，且仓库变量 AUTO_DEPLOY_SERVER 为字符串 true |
| 热门编辑仍不能使用 | 此流程只发布前端；按热门产品管理文档单独恢复 API 服务 |
