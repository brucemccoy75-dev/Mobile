#!/usr/bin/env node

// Node 18 is the floor: below it there is no global fetch, and the failure
// surfaces as a bare "fetch is not defined" from inside a retry loop.
// This check deliberately avoids top-level await so it still runs (rather
// than failing to parse) on the old versions it is meant to catch.
const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  process.stderr.write(
    `\nmap3d needs Node 18 or newer (you have ${process.versions.node}).\n` +
      `Node 16 and older have no global fetch.\n\n` +
      `  nvm install 18 && nvm use 18\n` +
      `  or download from https://nodejs.org\n\n`,
  );
  process.exit(1);
}

import('../src/cli.js')
  .then(({ main }) => main(process.argv.slice(2)))
  .then((code) => {
    if (code) process.exitCode = code;
  })
  .catch((err) => {
    process.stderr.write(`\nmap3d: ${err.message}\n`);
    if (process.env.MAP3D_DEBUG) process.stderr.write(`${err.stack}\n`);
    process.exitCode = 1;
  });
