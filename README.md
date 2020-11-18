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

This plugin will build your [AWS SAM CLI](https://github.com/awslabs/aws-sam-cli) project using Webpack. You can use it to replace the `sam build` step if every function in your SAM template uses the `nodejs10.x` or `nodejs12.x` runtime. If your project uses other runtimes then look at [Building Apps with SAM, TypeScript and VS Code Debugging](http://www.goingserverless.com/blog/building-apps-with-sam-typescript-and-vscode-debugging).

I started this project for two reasons:

1. SAM doesn't have good support for TypeScript
1. SAM build is slow because it runs `npm pack` and `npm install` for every function in your project.

The goals for this projects are:

1. Build your SAM project using Webpack (including support for watch mode)
1. Support TypeScript and Babel
1. Compatibility with running `sam build`
1. Automatically generate VS Code debugging configuration

<h2 align="center">Usage with TypeScript</h2>

<h3 align="center">Installation</h3>

Create a `package.json` in your projects root folder using `npm init` or `yarn init`.

Install the development dependencies:

```bash
npm install webpack webpack-cli typescript ts-loader aws-sam-webpack-plugin @types/aws-lambda --save-dev
```

or

```bash
yarn add webpack webpack-cli typescript ts-loader aws-sam-webpack-plugin @types/aws-lambda -D
```

Install the production dependencies:

```bash
npm install aws-sdk --save
```

or

```bash
yarn add aws-sdk --save
```

<h3 align="center">webpack.config.js</h3>

Create a `webpack.config.js` file in your projects root folder and add this plugin. The `entry` points can be set automatically using the `.entry()` method from this plugin. The output should go to `.aws-sam/build`.

**Tip:** If you set `entry` to `() => awsSamPlugin.entry()` it will reload your SAM configuration every time webpack rebuilds. You can disable this by setting `entry` to `awsSamPlugin.entry()`

Example:

```js
const path = require("path");
const AwsSamPlugin = require("aws-sam-webpack-plugin");

const awsSamPlugin = new AwsSamPlugin();

module.exports = {
  // Loads the entry object from the AWS::Serverless::Function resources in your
  // SAM config. Setting this to a function will
  entry: () => awsSamPlugin.entry(),

  // Write the output to the .aws-sam/build folder
  output: {
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: "commonjs2",
    path: path.resolve(".")
  },

  // Create source maps
  devtool: "source-map",

  // Resolve .ts and .js extensions
  resolve: {
    extensions: [".ts", ".js"]
  },

  // Target node
  target: "node",

  // AWS recommends always including the aws-sdk in your Lambda package but excluding can significantly reduce
  // the size of your deployment package. If you want to always include it then comment out this line. It has
  // been included conditionally because the node10.x docker image used by SAM local doesn't include it.
  externals: process.env.NODE_ENV === "development" ? [] : ["aws-sdk"],

  // Set the webpack mode
  mode: process.env.NODE_ENV || "production",

  // Add the TypeScript loader
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }]
  },

  // Add the AWS SAM Webpack plugin
  plugins: [awsSamPlugin]
};
```

<h3 align="center">tsconfig.json</h3>

Create a TypeScript config file that compiles `.ts` and `.js` files from the `src` folder.

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

<h3 align="center">package.json (optional)</h3>

To make building simple I like to add some scripts to the `package.json` which handles building, building in watch mode and cleaning up.

```json
{
  "scripts": {
    "build": "webpack-cli",
    "clean": "rimraf .aws-sam .vscode",
    "prebuild": "rimraf .aws-sam .vscode",
    "prewatch": "rimraf .aws-sam .vscode",
    "watch": "webpack-cli -w"
  }
}
```

You can set the `NODE_ENV` environment variable while executing the scripts to change how it's built:

```bash
NODE_ENV=development npm run-script build
```

<h3 align="center">src/{function}</h3>

Create a `src` folder with one sub-folder for each function. Place your handler and any test code in here.

<h3 align="center">template.yaml</h3>

Create a `template.yaml` in the project root. For the `CodeUri` use the functions folder (i.e. `src/{folder}`). Example:

```yaml
MyFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: src/my-function
    Handler: app.handler
```

<h2 align="center">Usage with Babel</h2>

<h3 align="center">Installation</h3>

Create a `package.json` in your projects root folder using `npm init` or `yarn init`.

Install the development dependencies:

```bash
npm install webpack webpack-cli aws-sam-webpack-plugin @babel/cli @babel/core @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-typescript @babel/plugin-transform-runtime babel-loader --save-dev
```

or

```bash
yarn add webpack webpack-cli aws-sam-webpack-plugin @babel/cli @babel/core @babel/plugin-proposal-class-properties @babel/preset-env @babel/preset-typescript @babel/plugin-transform-runtime babel-loader -D
```

Install the production dependencies:

```bash
npm install aws-sdk source-map-support @babel/runtime --save
```

or

```bash
yarn add aws-sdk source-map-support @babel/runtime --save
```

<h3 align="center">webpack.config.js</h3>

Create a `webpack.config.js` file in your projects root folder and add this plugin. The `entry` points can be set automatically using the `.entry()` method from this plugin. The output should go to `.aws-sam/build`.

**Tip:** If you set `entry` to `() => awsSamPlugin.entry()` it will reload your SAM configuration every time webpack rebuilds. You can disable this by setting `entry` to `awsSamPlugin.entry()`

Example:

```js
const path = require("path");
const AwsSamPlugin = require("aws-sam-webpack-plugin");

const awsSamPlugin = new AwsSamPlugin();

module.exports = {
  // Loads the entry object from the AWS::Serverless::Function resources in your
  // SAM config. Setting this to a function will
  entry: () => awsSamPlugin.entry(),

  // Write the output to the .aws-sam/build folder
  output: {
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: "commonjs2",
    path: path.resolve(".")
  },

  // Create source maps
  devtool: "source-map",

  // Resolve .ts and .js extensions
  resolve: {
    extensions: [".ts", ".js"]
  },

  // Target node
  target: "node",

  // AWS recommends always including the aws-sdk in your Lambda package but excluding can significantly reduce
  // the size of your deployment package. If you want to always include it then comment out this line. It has
  // been included conditionally because the node10.x docker image used by SAM local doesn't include it.
  externals: process.env.NODE_ENV === "development" ? [] : ["aws-sdk"],

  // Set the webpack mode
  mode: process.env.NODE_ENV || "production",

  // Add the TypeScript loader
  module: {
    rules: [
      { test: /\.jsx?$/, loader: "babel-loader" },
      { test: /\.tsx?$/, loader: "babel-loader" }
    ]
  },

  // Add the AWS SAM Webpack plugin
  plugins: [awsSamPlugin]
};
```

<h3 align="center">babel.config.js</h3>

Create a `babel.config.js` file at the project root

```javascript
module.exports = {
  plugins: [
    "@babel/proposal-class-properties",
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true
      }
    ]
  ],
  presets: ["@babel/env", "@babel/typescript"]
};
```

<h3 align="center">package.json (optional)</h3>

To make building simple I like to add some scripts to the `package.json` which handle building, building in watch mode and cleaning up.

```json
{
  "scripts": {
    "build": "webpack-cli",
    "clean": "rimraf .aws-sam .vscode",
    "prebuild": "rimraf .aws-sam .vscode",
    "prewatch": "rimraf .aws-sam .vscode",
    "watch": "webpack-cli -w"
  }
}
```

You can set the `NODE_ENV` environment variable while executing the commands to change how it's built:

```bash
NODE_ENV=development npm run-script build
```

<h3 align="center">src/{function}</h3>

Create a `src` folder with one sub-folder for each function. Place your handler and any test code in here.

<h3 align="center">template.yaml</h3>

Create a `template.yaml` in the project root. For the `CodeUri` use the functions folder (i.e. `src/{folder}`). Example:

```yaml
MyFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: src/my-function
    Handler: app.handler
```

<h2 align="center">Source Map Support</h2>

To enable source map support on Lambda make sure you set the environment variable `NODE_OPTIONS` to `--enable-source-maps` for your Lambda.

<h2 align="center">VS Code Debugging</h2>

To debug your Lambda using VS Code add the option `-d 5858` when using `sam local invoke` to launch the Node debugger then switch to the debugger in VS Code. From the VS Code debugger select the Lambda function you want to debug and click run. As of VS Code version 1.51 and SAM CLI version 1.10.0 the debugger will stop at the bootstrap file. Click the continue button and it will go to the first break point.

You should be able to set breakpoints in your source code, step through the code and view values from the editor.

<h2 align="center">Building Multiple Projects (Experimental)</h2>

From v0.5.0 you can build multiple SAM projects from a single `webpack.config.js` by using the `projects` option. All of the SAM projects need to be located below a common point on the filesystem. This could be the same folder that contains your `webpack.config.js` or another folder like `services` (any name is ok).

The `projects` option accepts a JavaScript object where the key is a shortname for the project and the value can be:

1. The path to the root folder for your SAM project. The plugin will look for a `template.yaml` or `template.yml` in that folder.
1. The path to a SAM template. This allows you to use a different a template name. The folder the template is located in will be used as the root folder for that SAM project.

For example: The following will build two projects, `projectA` and `projectB`. For `projectA` the plugin will look for either `template.yaml` or `template.yml` in the folder `./services/project-a` but for `projectB` it will only use `project.yaml` in the `./services/project-b` folder.

```javascript
const awsSamPlugin = new AwsSamPlugin({
  projects: {
    projectA: "./services/project-a",
    projectB: "./services/project-b/project.yaml"
  }
});
```

If you are upgrading from instructions prior to 0.5.0 you also need to modify the `output` section of your `webpack.config.js` so that Webpack uses the plugins `.filename()` method to determine the name of the output file. This will create a `.aws-sam/build` folder in correct SAM project root.

```javascript
module.exports = {
  output: {
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: "commonjs2",
    path: path.resolve(".")
  }
};
```

Once you have done this you should be able to execute Webpack from the root folder for your project (typically where you have your `package.json`, `webpack.config.js`, etc). In this example that folder would also contain the `services` folder.

<h2 align="center">Options</h2>

| Name              | Type        | Default           | Description                                                                                                                                                                           |
| :---------------- | :---------- | :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`outFile`**     | `{String}`  | `app`             | The name of the Javascript file to output without the `.js` extension. For example: `index` will generate `index.js`. By default it will use `app`                                    |
| **`projects`**    | `{Object}`  | `{"default":"."}` | A JavaScript object where the key is the name of the project and the value is the path to the SAM template or a folder containing a `template.yaml` or `template.yml` for the project |
| **`vscodeDebug`** | `{Boolean}` | `true`            | Also generate a `.vscode/launch.json` file for debugging Lambda with SAM CLI local S                                                                                                  |

### `vscodeDebug`

Enable/disable automatically generating a `.vscode/launch.json` file. This file contains the VS Code debug configuration for all of the Lambdas from your `template.yaml`.

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
