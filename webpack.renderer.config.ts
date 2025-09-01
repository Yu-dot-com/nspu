import type { Configuration } from 'webpack';
import path from "path";
import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'postcss-loader' }],
  },
  {
    test: /\.(png|jpe?g|gif|svg)$/i,
    type: 'asset/resource',
  }
);

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.jpg', '.jpeg', '.png', '.gif', '.svg'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
};
//webpack.remainder.config.ts