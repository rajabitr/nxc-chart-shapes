import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const production = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/umd/nxc-chart-shapes.js',
      format: 'umd',
      name: 'NXCChartShapes',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/umd/nxc-chart-shapes.min.js',
      format: 'umd',
      name: 'NXCChartShapes',
      sourcemap: true,
      exports: 'named',
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      outDir: 'dist/umd',
    }),
  ],
};
