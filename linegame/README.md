`src/` code available in the sourcemap. 

`.webpack.config.js`:
```js
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        query: {
          presets: ["@babel/preset-typescript"],
          plugins: [
            "transform-inline-scss",
            "@babel/plugin-syntax-dynamic-import"
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new ProgressBarPlugin(),
    new HTMLWebpackPlugin({
      title: "Line Game",
      template: "public/index.html"
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, "public"),
        to: path.resolve(__dirname, "dist"),
        ignore: ["index.html"]
      }
    ])
  ]
};
```

`package.json`:
```json
{
  "name": "linegame",
  "version": "1.0.0",
  "private": true,
  "license": "MIT",
  "scripts": {
    "start": "webpack --watch"
  },
  "devDependencies": {
    "@babel/core": "^7.5.5",
    "@babel/plugin-syntax-dynamic-import": "^7.2.0",
    "@babel/plugin-transform-typescript": "^7.5.5",
    "@babel/preset-typescript": "^7.3.3",
    "babel-loader": "^8.0.6",
    "babel-plugin-transform-inline-scss": "^1.0.0",
    "copy-webpack-plugin": "^5.0.3",
    "html-webpack-plugin": "^3.2.0",
    "prettier": "^1.18.2",
    "progress-bar-webpack-plugin": "^1.12.1",
    "ts-loader": "^6.0.4",
    "typescript": "^3.5.3",
    "webpack": "^4.36.1",
    "webpack-cli": "^3.3.6"
  },
  "dependencies": {
  }
}
```

`tsconfig.json`:
```
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "*": ["types/*"] },
    "outDir": "./dist",
    "target": "es2017",
    "module": "esnext",
    "noImplicitAny": true,
    "lib": ["es2017", "dom"],
    "strict": true,
    "isolatedModules": true,
    "sourceMap": true,
    "types": []
  },
  "include": ["src/**/*", "bin/**/*", "test/**/*", "index.ts"],
  "exclude": ["src/**/*.spec.ts"]
}
```

`public/index.html`:
```
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8" />

    <!-- Must -->
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta
      name="viewport"
      content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover"
    />
    <meta name="description" content="Line Game" />
    <meta name="keywords" content="Line Game" />
    <title><%= htmlWebpackPlugin.options.title %></title>

    <!-- Android  -->
    <meta name="theme-color" content="purple" />
    <meta name="mobile-web-app-capable" content="yes" />

    <!-- iOS -->
    <meta name="apple-mobile-web-app-title" content="Line Game" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />

    <!-- Windows  -->
    <meta name="msapplication-navbutton-color" content="red" />
    <meta name="msapplication-TileColor" content="red" />
    <meta name="msapplication-TileImage" content="ms-icon-144x144.png" />
    <meta name="msapplication-config" content="browserconfig.xml" />

    <!-- Pinned Sites  -->
    <meta name="application-name" content="Window System" />
    <meta name="msapplication-tooltip" content="Window System" />
    <meta name="msapplication-starturl" content="/" />

    <!-- Tap highlighting  -->
    <meta name="msapplication-tap-highlight" content="no" />

    <!-- UC Mobile Browser  -->
    <meta name="full-screen" content="yes" />
    <meta name="browsermode" content="application" />

    <!-- Link Tags  -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2c868e" />
    <meta name="apple-mobile-web-app-title" content="Window" />
    <meta name="application-name" content="Window" />
    <meta name="msapplication-TileColor" content="#2c868e" />
    <meta name="theme-color" content="#2c868e" />
  </head>
  <body touch-action="none"></body>
</html>
```
