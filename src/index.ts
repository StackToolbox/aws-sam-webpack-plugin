import * as fs from "fs";
import { yamlParse, yamlDump } from "yaml-cfn";

interface AwsSamPluginOptions {
  vscodeDebug: boolean;
}

class AwsSamPlugin {
  private options: AwsSamPluginOptions;
  private samConfig: any;
  private launchConfig: any;

  constructor(options: AwsSamPluginOptions) {
    this.options = { vscodeDebug: true, ...options };
  }

  // Returns the name of the SAM template file or null if it's not found
  private templateName() {
    for (const f of ["template.yaml", "template.yml"]) {
      if (fs.existsSync(f)) {
        return f;
      }
    }

    return null;
  }

  // Returns a webpack entry object based on the SAM template
  public entry() {
    const templateName = this.templateName();

    if (templateName === null) {
      console.log("No SAM template found");
      return null;
    }

    this.samConfig = yamlParse(fs.readFileSync(templateName).toString());
    this.launchConfig = {
      version: "0.2.0",
      configurations: []
    };

    const defaultRuntime = this.samConfig.Globals?.Function?.Runtime ?? null;
    const defaultHandler = this.samConfig.Globals?.Function?.Handler ?? null;
    const defaultCodeUri = this.samConfig.Globals?.Function?.CodeUri ?? null;

    const entryPoints: { [pname: string]: string } = {};

    // Loop through all of the resources
    for (const resourceKey in this.samConfig.Resources) {
      const resource = this.samConfig.Resources[resourceKey];

      // Find all of the functions
      if (resource.Type === "AWS::Serverless::Function") {
        const properties = resource.Properties;
        if (!properties) {
          throw new Error(`${resourceKey} is missing Properties`);
        }
        // Check the runtime is supported
        if (
          !["nodejs8.10", "nodejs10.x"].includes(
            properties.Runtime ?? defaultRuntime
          )
        ) {
          throw new Error(
            `${resourceKey} has an unsupport Runtime. Must be nodejs8.10 or nodejs10.x`
          );
        }

        // Continue with a warning if they're using inline code
        if (properties.InlineCode) {
          console.log(`WARNING: This plugin does not compile inline code. The InlineCode for '${resourceKey}' will be copied 'as is'.`);
          continue;
        }

        // Check we have a valid handler
        const handler = properties.Handler ?? defaultHandler;
        if (!handler) {
          throw new Error(`${resourceKey} is missing a Handler`);
        }
        const handlerComponents = handler.split(".");
        if (handlerComponents.length !== 2) {
          throw new Error(
            `${resourceKey} Handler must contain exactly one "."`
          );
        }

        // Check we have a CodeUri
        const codeUri = properties.CodeUri ?? defaultCodeUri;
        if (!codeUri) {
          throw new Error(`${resourceKey} is missing a CodeUri`);
        }

        const basePath = codeUri ? `./${codeUri}` : ".";
        const fileBase = `${basePath}/${handlerComponents[0]}`;
        for (const ext of [".ts", ".js"]) {
          if (fs.existsSync(`${fileBase}${ext}`)) {
            // Generate the launch config for the VS Code debugger
            this.launchConfig.configurations.push({
              name: resourceKey,
              type: "node",
              request: "attach",
              address: "localhost",
              port: 5858,
              localRoot: `\${workspaceRoot}/.aws-sam/build/${resourceKey}`,
              remoteRoot: "/var/task",
              protocol: "inspector",
              stopOnEntry: false,
              outFiles: [
                `\${workspaceRoot}/.aws-sam/build/${resourceKey}/app.js`
              ],
              sourceMaps: true
            });

            // Add the entry point for webpack
            entryPoints[resourceKey] = `${fileBase}${ext}`;
            this.samConfig.Resources[
              resourceKey
            ].Properties.CodeUri = resourceKey;
            this.samConfig.Resources[resourceKey].Properties.Handler = `app.${
              handlerComponents[1]
            }`;
          }
        }
      }
    }

    return entryPoints;
  }

  public apply(compiler: any) {
    compiler.hooks.afterEmit.tap("SamPlugin", (compilation: any) => {
      if (this.samConfig && this.launchConfig) {
        fs.writeFileSync(
          `.aws-sam/build/${this.templateName()}`,
          yamlDump(this.samConfig)
        );
        if (this.options.vscodeDebug) {
          if (!fs.existsSync(".vscode")) {
            fs.mkdirSync(".vscode");
          }
          fs.writeFileSync(
            ".vscode/launch.json",
            JSON.stringify(this.launchConfig)
          );
        }
      } else {
        console.log("It looks like SamPlugin.entryPoints() was not called");
      }
    });
  }
}

module.exports = AwsSamPlugin;
