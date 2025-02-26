/* eslint-disable @typescript-eslint/no-require-imports */
require('esbuild').build({
    entryPoints: ['server.js'],
    outfile: 'dist/server-bundle.js',
    bundle: true,
    platform: 'node',
    external: ['esbuild'], // if needed
  }).catch(() => process.exit(1));
  