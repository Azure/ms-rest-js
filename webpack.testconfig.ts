import * as webpack from "webpack";
import * as glob from "glob";
import * as path from "path";

const config: webpack.Configuration = {
  entry: glob.sync(path.join(__dirname, "test/**/*.ts")),
  mode: "development",
  devtool: "source-map",
  output: {
    filename: "msRest.browser.test.js",
    path: path.resolve(__dirname, "test")
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/(\.).+util\/base64/, path.resolve(__dirname, "./lib/util/base64.browser.ts")),
    new webpack.NormalModuleReplacementPlugin(/(\.).+util\/xml/, path.resolve(__dirname, "./lib/util/xml.browser.ts")),
    new webpack.NormalModuleReplacementPlugin(/(\.).+defaultHttpClient/, path.resolve(__dirname, "./lib/defaultHttpClient.browser.ts")),
    new webpack.NormalModuleReplacementPlugin(/(\.).+msRestUserAgentPolicy/, path.resolve(__dirname, "./lib/policies/msRestUserAgentPolicy.browser.ts"))
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /(node_modules)/,
        options: { configFile: path.join(__dirname, "./tsconfig.es.json") }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  node: {
    fs: "empty",
    net: false,
    path: "empty",
    dns: false,
    tls: false,
    tty: false,
    v8: false,
    Buffer: false,
    process: false,
    stream: "empty"
  }
};

export = config;
