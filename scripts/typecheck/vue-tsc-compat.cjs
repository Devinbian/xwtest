#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const semver = require('semver');

const tsPkg = require('typescript/package.json');
const readFileSync = fs.readFileSync;
const proxyApiPath = require.resolve('vue-tsc/out/index');
const { state } = require('vue-tsc/out/shared');

const resolveFirst = (ids) => {
  for (const id of ids) {
    try {
      return require.resolve(id);
    } catch {
      // try next
    }
  }
  throw new Error(`Cannot resolve any of: ${ids.join(', ')}`);
};

// TypeScript 5.7+ changed `lib/tsc.js` to a shim; patch the real implementation first.
const tscPath = resolveFirst(['typescript/lib/_tsc', 'typescript/lib/tsc']);
const normalizedTscPath = path.resolve(tscPath);

fs.readFileSync = (...args) => {
  const targetPath = String(args[0] ?? '');
  if (path.resolve(targetPath) === normalizedTscPath) {
    let tsc = String(readFileSync(...args));

    const tryReplace = (search, replace, required = true) => {
      const before = tsc;
      tsc = tsc.replace(search, replace);
      if (required && tsc === before) {
        throw new Error(`Search string not found: ${search.toString()}`);
      }
    };

    // add *.vue files to allow extensions
    tryReplace(/supportedTSExtensions = .*(?=;)/, (s) => `${s}.concat([[".vue"]])`);
    tryReplace(/supportedJSExtensions = .*(?=;)/, (s) => `${s}.concat([[".vue"]])`);
    tryReplace(/allSupportedExtensions = .*(?=;)/, (s) => `${s}.concat([[".vue"]])`);

    // proxy createProgram apis
    tryReplace(
      /function createProgram\(.+\) {/,
      (s) => `${s} return require(${JSON.stringify(proxyApiPath)}).createProgram(...arguments);`,
    );

    // Optional compatibility patches for older TS internal layouts.
    if (semver.gt(tsPkg.version, '5.0.0')) {
      tryReplace(
        'for (const existingRoot of buildInfoVersionMap.roots) {',
        `for (const existingRoot of buildInfoVersionMap.roots
          .filter(file => !file.toLowerCase().includes('__vls_'))
          .map(file => file.replace(/\\.vue\\.(j|t)sx?$/i, '.vue'))
        ) {`,
        false,
      );
      tryReplace(
        'return [toFileId(key), toFileIdListId(state.exportedModulesMap.getValues(key))];',
        'return [toFileId(key), toFileIdListId(new Set(arrayFrom(state.exportedModulesMap.getValues(key)).filter(file => file !== void 0)))];',
        false,
      );
    }
    if (semver.gte(tsPkg.version, '5.0.4')) {
      tryReplace(
        'return createBuilderProgramUsingProgramBuildInfo(buildInfo, buildInfoPath, host);',
        (s) => `buildInfo.program.fileNames = buildInfo.program.fileNames
          .filter(file => !file.toLowerCase().includes('__vls_'))
          .map(file => file.replace(/\\.vue\\.(j|t)sx?$/i, '.vue'));\n${s}`,
        false,
      );
    }

    return tsc;
  }
  return readFileSync(...args);
};

(function main() {
  try {
    require(tscPath);
  } catch (err) {
    if (err === 'hook') {
      state.hook.worker.then(main);
    } else {
      throw err;
    }
  }
})();
