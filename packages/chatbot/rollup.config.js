import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';

export default {
  input: 'src/Chatbot.jsx',
  output: {
    file: 'dist/chatbot.js',
    format: 'iife',
    name: 'BuizbotWidget',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.jsx', '.js'],
    }),
    postcss({ inject: true, minimize: true }),
    terser(),
  ],
  external: ['react', 'react-dom'],
};