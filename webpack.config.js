/* eslint-disable no-undef */
const path = require('path');
const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const urlDev = "https://localhost:3000/";
const urlProd = "https://sendasta.com";

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: ["./src/taskpane/taskpane.js", "./src/taskpane/taskpane.html"],
      commands: "./src/commands/commands.js",
      "taskpane-v2": ["./src/taskpane-v2/taskpane.js", "./src/taskpane-v2/taskpane.html"],
      "commands-v2": "./src/commands-v2/commands.js",
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      // Don't clean public/ — the marketing site's Vite build also emits here,
      // and webpack overwrites its own files deterministically anyway. Cleaning
      // wipes the marketing site (index.html, for-it-admins/, hashed assets)
      // every time `npm run build:addin` runs locally.
      clean: false,
    },
    resolve: {
      extensions: [".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            // Marketing site static assets — logo, favicon, videos used by the Vite React app
            from: "carrd website/assets/images/logo-sendasta-white.svg",
            to: "assets/logo-sendasta-white.svg",
          },
          {
            from: "carrd website/assets/images/favicon.png",
            to: "assets/favicon.png",
          },
          {
            from: "carrd website/assets/videos",
            to: "assets/videos",
          },
          {
            from: "public-static",
            to: ".",
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"],
      }),
      new HtmlWebpackPlugin({
        filename: "taskpane-v2.html",
        template: "./src/taskpane-v2/taskpane.html",
        chunks: ["polyfill", "taskpane-v2"],
      }),
      new HtmlWebpackPlugin({
        filename: "commands-v2.html",
        template: "./src/commands-v2/commands.html",
        chunks: ["polyfill", "commands-v2"],
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
    },
  };

  return config;
};
