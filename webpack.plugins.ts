import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
    new HtmlWebpackPlugin({
    template: './src/index.html',
    meta: {
      'Content-Security-Policy': {
        'http-equiv': 'Content-Security-Policy',
        content: `
          default-src 'self';
          script-src 'self' 'unsafe-inline';
          connect-src 'self' https://cewmylpshuskuoomkzox.supabase.co;
          img-src 'self' data:;
          style-src 'self' 'unsafe-inline';
        `.replace(/\n/g, ''),
      },
    },
  }),
];
//webpack.plugin.ts