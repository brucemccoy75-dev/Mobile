#!/usr/bin/env node
import { main } from '../src/cli.js';

main(process.argv.slice(2))
  .then((code) => {
    if (code) process.exitCode = code;
  })
  .catch((err) => {
    process.stderr.write(`\nmap3d: ${err.message}\n`);
    if (process.env.MAP3D_DEBUG) process.stderr.write(`${err.stack}\n`);
    process.exitCode = 1;
  });
