// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';

export default [
  // Configuration for the main library (turntable.ts)
  {
    input: 'src/turntable.ts',
    output: [
      {
        file: 'npm/turntable.cjs',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'npm/turntable.esm.js',
        format: 'esm',
        exports: 'named',
      },
    ],
    plugins: [
      del({ targets: 'npm/*', runOnce: true }),
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.npm.json' }),
      terser()
    ],
  },
  
  // Configuration for the IIFE format (autoinit.ts)
  {
    input: 'src/autoinit.ts',
    output: {
      file: 'npm/autoinit.js',
      format: 'iife',
      name: 'AutoInit', // Global variable name for autoinit script
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.npm.json' }),
      terser()
    ],
  }
];
