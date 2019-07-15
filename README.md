[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]

<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>AWS SAM Webpack Plugin</h1>
  <p>A Webpack plugin that replaces the <code>sam build</code> step for <a href="https://github.com/awslabs/aws-sam-cli">AWS SAM CLI</a> projects.</p>
</div>

<h2 align="center">Background</h2>

This plugin will build your [AWS SAM CLI](https://github.com/awslabs/aws-sam-cli) project using Webpack. You can use it to replace of the `sam build` step if every function in your template uses  the `nodejs8.10` or `nodejs10.x` runtime. If your project uses other runtimes then you should look at [Building Apps with SAM, TypeScript and VS Code Debugging](http://www.goingserverless.com/blog/building-apps-with-sam-typescript-and-vscode-debugging).

The goals for this projects are:

1. Build your SAM project using Webpack (including support for watch mode)
1. Support TypeScript and Babel
1. Compatibility with running `sam build`
1. Automatically generate VS Code debugging configuration

**Note:** This plugin does not currently support YAML tag syntax. You need to use `Fn::Sub:` instead of `!Sub`, `Fn::GetAtt:` instead of `!GetAtt`, etc.

<h2 align="center">Install</h2>

```bash
npm install aws-sam-webpack-plugin --save-dev
```

<h2 align="center">Usage</h2>

Add the plugin to your `webpack.config.js` file. Use the `.entry()` method to load the Webpack entry config by looking for resources with the type  `AWS::Serverless::Function` in your `template.yaml` or `template.yml`.


**webpack.config.js**

```js
const AwsSamPlugin = require("aws-sam-webpack-plugin");

const awsSamPlugin = new AwsSamPlugin();

{
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

**tsconfig.json**

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

You will only have one `package.json` for the entire project. You may want to add some of thes entries.

```json
{
  "scripts": {
    "build": "npm run-script clean && NODE_ENV=production webpack-cli",
    "clean": "rimraf .aws-sam .vscode",
    "watch": "npm run-script clean && NODE_ENV=development webpack-cli -w",
  },
  "devDependencies": {
    "@types/aws-lambda": "^8.10.28"
  },
  "dependencies": {
    "aws-sdk": "^2.493.0",
    "source-map-support": "^0.5.12"
  }
}
```
**src/{function}**

Create a `src` folder with one sub-folder for each function and place your handler code inside that folder.

**template.yaml**

Create a `template.yaml` in the project root with your `webpack.config.js`. For the `CodeUri` use the functions folder (i.e. `src/{folder}`). Example:

```yaml
  MyFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-function
      Handler: app.handler
```

<h2 align="center">Options</h2>

|            Name             |         Type         |   Default   | Description                                                                                                                    |
| :-------------------------: | :------------------: | :---------: | :----------------------------------------------------------------------------------------------------------------------------- |
|      **`vscodeDebug`**      |     `{Boolean}`      |   `true`    | Also generate a `.vscode/launch.json` file for debugging Lambda with SAM CLI local                                            S |


### `vscodeDebug`

Enable/disable automatically generating a `.vscode/launch.json` file. This file contains the VS Code debug configuration for all of the Lambda's from your `template.yaml`.

**webpack.config.js**

```js
const awsSamPlugin = new AwsSamPlugin({ vscodeDebug: false });
```

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
[node]: https://img.shields.io/node/v/aws-sam-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack/aws-sam-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack/aws-sam-webpack-plugin
