#!/usr/bin/env node
const argv = require('yargs').argv

const exec = require('execa').sync;

const getVersion = require('../app/util/get-version');

const pkg = require('../app/package');

const {
  nightly,
  publish
} = argv;

const availablePlatforms = {
  win: 1,
  linux: 1,
  mac: 1
};

var nightlyOptions = [];

let nightlyVersion = nightly && getVersion(pkg, nightly && {
  nightly: 'nightly'
});

if (nightlyVersion) {

  nightlyOptions = [
    `-c.buildVersion=${nightlyVersion}`,
    '-c.artifactName=${productName}-${os}-${arch}.${ext}'
  ];
}

const platforms =
  Object.keys(availablePlatforms)
    .map(k => argv[k] && k)
    .filter(k => k);

const platformOptions = platforms.map(p => `--${p}`);

const publishOptions = publish ? [ '--publish=always' ] : [];

const args = [
  ...platformOptions,
  ...nightlyOptions,
  ...publishOptions
];

console.log(`
Building ${pkg.name} distro

  version: ${nightlyVersion || pkg.version}
  platforms: [${ platforms }]
  publish: ${publish || false}

---

electron-builder ${ args.join(' ') }
`
);

exec('electron-builder', args, {
  stdio: 'inherit'
});