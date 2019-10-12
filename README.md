[![npm][npm]][npm-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>AWS SAM Webpack Plugin</h1>
  <p>A Webpack plugin that replaces the <code>sam build</code> step for <a href="https://github.com/awslabs/aws-sam-cli">AWS SAM CLI</a> projects.</p>
</div>

<h2 align="center">Background</h2>

This plugin will build your [AWS SAM CLI](https://github.com/awslabs/aws-sam-cli) project using Webpack. It replaces the `sam build` step if every function in your template uses  the `nodejs8.10` or `nodejs10.x` runtime. If your project uses other runtimes then you should look at [Building Apps with SAM, TypeScript and VS Code Debugging](http://www.goingserverless.com/blog/building-apps-with-sam-typescript-and-vscode-debugging).

The goals for this projects are:

1. Build your SAM project using Webpack (including support for watch mode)
1. Support TypeScript and Babel
1. Compatibility with running `sam build`
1. Automatically generate VS Code debugging configuration

<h2 align="center">Install</h2>

Create a `package.json` in your projects root folder using `npm init`.

Install the development dependencies:

```bash
npm install webpack webpack-cli typescript ts-loader aws-sam-webpack-plugin @types/aws-lambda --save-dev
```

Install the production dependencies:

```bash
npm install aws-sdk source-map-support --save
```

<h2 align="center">Usage with TypeScript</h2>

**webpack.config.js**

Create `webpack.config.js` file in your projects root folder and add this plugin. Use the `.entry()` method to load the Webpack entry config by looking for resources with the type  `AWS::Serverless::Function` in your `template.yaml` or `template.yml`.

You will want to send the output to `.aws-sam/build`.

Example:

```js
const AwsSamPlugin = require("aws-sam-webpack-plugin");

const awsSamPlugin = new AwsSamPlugin();

module.exports = {
  // Loads the entry object from the AWS::Serverless::Function resources in your
  // template.yaml or template.yml
  entry: awsSamPlugin.entry(),

  // Write the output to the .aws-sam/build folder
  output: {
    filename: "[name]/app.js",
    libraryTarget: "commonjs2",
    path: __dirname + "/.aws-sam/build/"
  },

  // Create source maps
  devtool: "source-map",

  // Resolve .ts and .js extensions
  resolve: {
    extensions: [".ts", ".js"]
  },

  // Target node
  target: "node",

  // Includes the aws-sdk only for development. The node10.x docker image
  // used by SAM CLI Local doens't include it but it's included in the actual
  // Lambda runtime.
  externals: process.env.NODE_ENV === "development" ? [] : ["aws-sdk"],

  // Set the webpack mode
  mode: process.env.NODE_ENV || "production",

  // Add the TypeScript loader
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  },

  // Add the AWS SAM Webpack plugin
  plugins: [
    awsSamPlugin
  ]
}
```

In this example I include the `aws-sdk` in development mode because the `nodejs10.x` docker image used by SAM Local doesn't include it. When deploying to production I make that external and rely on the version provided by Lambda.


**tsconfig.json**

Create a TypeScript config file.

Example:

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "allowJs": true,
    "checkJs": true,
    "sourceMap": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts", "src/**/*.js"]
}
```

**package.json**

In the `package.json` I like to add two (optional) scripts to build the project and start watch mode. You can execute these commands from the command line.

```json
{
  "scripts": {
    "build": "webpack-cli",
    "watch": "webpack-cli -w",
  }
}
```

You can set the `NODE_ENV` environment variable while executing the commands to change how it's built:

```bash
NODE_ENV=development npm run-script build
```

**src/{function}**

Create a `src` folder with one sub-folder for each function and place your handler and any test code in here.

**template.yaml**

Create a `template.yaml` in the project root. For the `CodeUri` use the functions folder (i.e. `src/{folder}`). Example:

```yaml
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-function
      Handler: app.handler
```

<h2 align="center">Usage with Babel</h2>

Install the following additional dependencies

```bash
npm install --save-dev \
    @babel/cli \
    @babel/core \
    @babel/plugin-proposal-class-properties \
    @babel/preset-env \
    @babel/preset-typescript \
    babel-loader
```

Create the following `babel.config.js` file at the project root

```javascript
module.exports = {
    "plugins": [
        "@babel/proposal-class-properties",
    ],
    "presets": [
        "@babel/env",
        "@babel/typescript",
    ]
}
```

Then modify your webpack configuration to use `babel-loader` instead of `ts-loader`.

```javascript
const AwsSamPlugin = require("aws-sam-webpack-plugin");
const awsSamPlugin = new AwsSamPlugin();

module.exports = {
  entry: awsSamPlugin.entry(),
  output: {
    filename: "[name]/app.js",
    libraryTarget: "commonjs2",
    path: __dirname + "/.aws-sam/build/"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"]
  },
  target: "node",
  externals: process.env.NODE_ENV === "development" ? [] : ["aws-sdk"],
  mode: process.env.NODE_ENV || "production",
  // use babel-loader instead of ts-loader
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: [
    awsSamPlugin
  ]
}
```

<h2 align="center">Options</h2>

|            Name             |         Type         |   Default   | Description                                                                                                                    |
| :-------------------------: | :------------------: | :---------: | :----------------------------------------------------------------------------------------------------------------------------- |
|      **`vscodeDebug`**      |     `{Boolean}`      |   `true`    | Also generate a `.vscode/launch.json` file for debugging Lambda with SAM CLI local                                            S |


### `vscodeDebug`

Enable/disable automatically generating a `.vscode/launch.json` file. This file contains the VS Code debug configuration for all of the Lambda's from your `template.yaml`.


<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/buggy">
          <img width="150" height="150" src="https://github.com/buggy.png?v=3&s=150">
          </br>
          Rich Buggy
        </a>
      </td>
    </tr>
  <tbody>
</table>

[npm]: https://img.shields.io/npm/v/aws-sam-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/aws-sam-webpack-plugin