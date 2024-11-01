/// <reference lib="deno.ns" />

import { build, emptyDir } from '@deno/dnt';

await emptyDir('./npm');

await build({
  entryPoints: ['./demo/src/turntable.ts'],
  outDir: './npm',
  compilerOptions: {
    lib: ['DOM', 'DOM.Iterable', 'ESNext'],
  },
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: JSON.parse(await Deno.readTextFile('./deno.json')).name,
    version: JSON.parse(await Deno.readTextFile('./deno.json')).version,
    description: JSON.parse(await Deno.readTextFile('./deno.json')).description,
    license: JSON.parse(await Deno.readTextFile('./deno.json')).license,
    repository: {
      type: 'git',
      url: 'git+https://github.com/flwkt/turntable.git',
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync('LICENSE', 'npm/LICENSE');
    Deno.copyFileSync('README.md', 'npm/README.md');
  },
});
