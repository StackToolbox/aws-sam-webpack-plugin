const fs = require("fs");
const yaml = require("yaml-js");

class SamPlugin {
  constructor(options) {
    this.options = { vscodeDebug: true, ...options };
  }

  // Returns the name of the SAM template file or null if it's not found
  templateName() {
    for (const f of ["template.yaml", "template.yml"]) {
      if (fs.existsSync(f)) {
        return f;
      }
    }

    return null;
  }

  // Returns a webpack entry object based on the SAM template
  entryPoints() {
    const templateName = this.templateName();

    if (templateName === null) {
      console.log("No SAM template found");
      return null;
    }

    this.cfg = yaml.load(fs.readFileSync(templateName).toString());
    this.launch = {
      version: "0.2.0",
      configurations: []
    };
    const entry = {};

    const defaultRuntime =
      this.cfg.Globals &&
      this.cfg.Globals.Function &&
      this.cfg.Globals.Function.Runtime
        ? this.cfg.Globals.Function.Runtime
        : null;
    const defaultHandler =
      this.cfg.Globals &&
      this.cfg.Globals.Function &&
      this.cfg.Globals.Function.Handler
        ? this.cfg.Globals.Function.Handler
        : null;

    // Loop through all of the resources
    for (const resourceKey in this.cfg.Resources) {
      const resource = this.cfg.Resources[resourceKey];

      // Find all of the functions
      if (resource.Type === "AWS::Serverless::Function") {
        const properties = resource.Properties;
        if (!properties) {
          throw new Error(`${resourceKey} is missing Properties`);
        }

        if (
          !["nodejs8.10", "nodejs10.x"].includes(
            properties.Runtime || defaultRuntime
          )
        ) {
          throw new Error(
            `${resourceKey} has an unsupport Runtime. Must be nodejs8.10 or nodejs10.x`
          );
        }
        if (!properties.Handler || defaultHandler) {
          throw new Error(`${resourceKey} is missing a Handler`);
        }
        const handler = (properties.Handler || defaultHandler).split(".");
        if (handler.length !== 2) {
          throw new Error(
            `${resourceKey} Handler must contain exactly one "."`
          );
        }

        if (!properties.CodeUri) {
          throw new Error(`${resourceKey} is missing a CodeUri`);
        }

        const basePath = properties.CodeUri ? `./${properties.CodeUri}` : ".";
        const fileBase = `${basePath}/${handler[0]}`;
        for (const ext of [".ts", ".js"]) {
          if (fs.existsSync(`${fileBase}${ext}`)) {
            this.launch.configurations.push({
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

            entry[resourceKey] = `${fileBase}${ext}`;
            this.cfg.Resources[resourceKey].Properties.CodeUri = resourceKey;
            this.cfg.Resources[resourceKey].Properties.Handler = `app.${
              handler[1]
            }`;
          }
        }
      }
    }

    return entry;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap("SamPlugin", compilation => {
      if (this.cfg && this.launch) {
        fs.writeFileSync(
          `.aws-sam/build/${this.templateName()}`,
          yaml.dump(this.cfg)
        );
        if (this.options.vscodeDebug) {
          fs.writeFileSync(".vscode/launch.json", JSON.stringify(this.launch));
        }
      } else {
        console.log("It looks like SamPlugin.entryPoints() was not called");
      }
    });
  }
}

module.exports = SamPlugin;