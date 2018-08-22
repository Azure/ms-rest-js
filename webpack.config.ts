import * as webpack from 'webpack';
import * as path from 'path';

const config: webpack.Configuration = {
  entry: './lib/msRest.ts',
  devtool: 'source-map',
  output: {
    filename: 'msRestBundle.js',
    path: __dirname,
    libraryTarget: 'var',
    library: 'msRest'
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/(\.).+util\/base64/, path.resolve(__dirname, "./lib/util/base64.browser.ts")),
    new webpack.NormalModuleReplacementPlugin(/(\.).+util\/xml/, path.resolve(__dirname, "./lib/util/xml.browser.ts")),
    new webpack.NormalModuleReplacementPlugin(/(\.).+defaultHttpClient/, path.resolve(__dirname, "./lib/defaultHttpClient.browser.ts"))
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /(node_modules|test)/,
        options: { configFile: path.join(__dirname, './tsconfig.es.json') }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "./policies/msRestUserAgentPolicy": path.resolve(__dirname, "./lib/policies/msRestUserAgentPolicy.stub")
    }
  },
  node: {
    fs: false,
    net: false,
    path: false,
    dns: false,
    tls: false,
    tty: false,
    v8: false,
    Buffer: false,
    process: false,
    stream: false
  }
};

export = config;
