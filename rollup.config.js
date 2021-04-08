import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'

const extensions = ['.ts', '.tsx']

export default {
  input: './src',
  output: {
    file: './dist/index.js',
    format: 'cjs',
  },
  external: ['prop-types', 'react', 'react-dom', 'numeral'],
  plugins: [
    resolve({ extensions }),
    commonjs(),
    babel({ babelrc: true, extensions, babelHelpers: 'bundled', exclude: 'node_modules/**' }),
    typescript(),
  ],
}
