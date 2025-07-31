import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/indexCore.ts', 
  output: {
    file: 'dist/waviz.umd.js',
    format: 'umd',
    name: 'Waviz', // window.Waviz in browser
    exports: 'named',
    sourcemap: true,
  },
  plugins: [typescript({  tsconfig: './tsconfig.rollup.json' })],
};