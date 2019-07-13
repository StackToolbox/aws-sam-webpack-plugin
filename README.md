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

This plugin will build your [AWS SAM CLI](https://github.com/awslabs/aws-sam-cli) projects using Webpack in way that replaces the `sam build` step. I created this project because I wanted to write my Lambda using TypeScript then use Webpack to build them.

To use this plugin:

1. Initialize your project using `sam init`
1. Create a `package.json` in the project root folder using `npm init`
1. Install Webpack and other `devDependencies` in the project root.

Note: To use this plugin every function needs to use the `nodejs8.10` or `nodejs10.x` runtime. If your project uses other runtimes then you should look at [Building Apps with SAM, TypeScript and VS Code Debugging](http://www.goingserverless.com/blog/building-apps-with-sam-typescript-and-vscode-debugging).


<h2 align="center">Install</h2>

```bash
npm install sam-webpack-plugin --save-dev
```

<h2 align="center">Usage</h2>

This plugin looks for `AWS::Serverless::Function` resources in your `template.yaml` or `template.yml` then builds each of these as it's own entry point/output.

**webpack.config.js**

```js
const SamPlugin = require("sam-webpack-plugin");

const samPlugin = new SamPlugin();

{
  // Loads the entry object from your template.yaml or tempalte.yml
  entry: samPlugin.entryPoints(),

  // Includes the aws-sdk only for development. The node10.x docker image
  // used by SAM CLI Local doens't include it but it's included in the actual
  // Lambda runtime.
  externals: process.env.NODE_ENV === "development" ? ["aws-sdk"] : [],

  // Add the AWS SAM Webpack plugin
  plugins: [
    samPlugin
  ]
}
```

You can

<h2 align="center">Options</h2>

|            Name             |         Type         |   Default   | Description                                                                                                                    |
| :-------------------------: | :------------------: | :---------: | :----------------------------------------------------------------------------------------------------------------------------- |
|          **`vscodeDebug`**          |     `{Boolean}`      |   `true`    | Also generate a `.vscode/launch.json` file for debugging Lambda with SAM CLI local |


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

[npm]: https://img.shields.io/npm/v/sam-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/sam-webpack-plugin
[node]: https://img.shields.io/node/v/sam-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack/sam-webpack-plugin.svg
[deps-url]: https://david-dm.org/webpack/sam-webpack-plugin
