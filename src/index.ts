import * as fs from "fs";
import * as path from "path";
import { yamlParse, yamlDump } from "yaml-cfn";

interface AwsSamProjectMap {
  [pname: string]: string;
}

interface AwsSamPluginOptions {
  projects: AwsSamProjectMap;
  vscodeDebug: boolean;
}

interface IEntryPointMap {
  [pname: string]: string;
}

class AwsSamPlugin {
  private static defaultTemplates = ["template.yaml", "template.yml"];
  private entryPoints: IEntryPointMap;
  private launchConfig: any;
  private options: AwsSamPluginOptions;
  private samConfigs: Array<{ buildRoot: string; entryPointName: string; outFile: string; projectKey: string; samConfig: any }>;

  constructor(options?: Partial<AwsSamPluginOptions>) {
    this.entryPoints = {};
    this.options = {
      projects: { default: "." },
      vscodeDebug: true,
      ...options
    };
    this.samConfigs = [];
  }

  // Returns the name of the SAM template file or null if it's not found
  private templateName(prefix: string) {
    for (const f of AwsSamPlugin.defaultTemplates) {
      const template = `${prefix}/${f}`;
      if (fs.existsSync(template)) {
        return template;
      }
    }

    return null;
  }

  // Returns a webpack entry object based on the SAM template
  private entryFor(projectKey: string, projectTemplate: string) {
    const samConfig = yamlParse(fs.readFileSync(projectTemplate).toString());

    const defaultRuntime = samConfig.Globals?.Function?.Runtime ?? null;
    const defaultHandler = samConfig.Globals?.Function?.Handler ?? null;
    const defaultCodeUri = samConfig.Globals?.Function?.CodeUri ?? null;

    // Loop through all of the resources
    for (const resourceKey in samConfig.Resources) {
      const resource = samConfig.Resources[resourceKey];

      // Find all of the functions
      if (resource.Type === "AWS::Serverless::Function") {
        const properties = resource.Properties;
        if (!properties) {
          throw new Error(`${resourceKey} is missing Properties`);
        }
        // Check the runtime is supported
        if (!["nodejs8.10", "nodejs10.x", "nodejs12.x"].includes(properties.Runtime ?? defaultRuntime)) {
          throw new Error(`${resourceKey} has an unsupport Runtime. Must be nodejs8.10, nodejs10.x or nodejs12.x`);
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
          throw new Error(`${resourceKey} Handler must contain exactly one "."`);
        }

        // Check we have a CodeUri
        const codeUri = properties.CodeUri ?? defaultCodeUri;
        if (!codeUri) {
          throw new Error(`${resourceKey} is missing a CodeUri`);
        }

        const projectPath = path.relative(".", path.dirname(projectTemplate));
        const basePath = codeUri ? `./${projectPath}/${codeUri}` : `./${projectPath}`;
        const fileBase = `${basePath}/${handlerComponents[0]}`;

        const buildRoot = projectPath === "" ? `.aws-sam/build` : `${projectPath}/.aws-sam/build`;
        // Generate the launch config for the VS Code debugger
        this.launchConfig.configurations.push({
          name: projectKey === "default" ? resourceKey : `${projectKey}:${resourceKey}`,
          type: "node",
          request: "attach",
          address: "localhost",
          port: 5858,
          localRoot: `\${workspaceRoot}/${buildRoot}/${resourceKey}`,
          remoteRoot: "/var/task",
          protocol: "inspector",
          stopOnEntry: false,
          outFiles: [`\${workspaceRoot}/${buildRoot}/${resourceKey}/app.js`],
          sourceMaps: true
        });

        // Add the entry point for webpack
        const entryPointName = projectKey === "default" ? resourceKey : `${projectKey}#${resourceKey}`;
        this.entryPoints[entryPointName] = fileBase;
        samConfig.Resources[resourceKey].Properties.CodeUri = resourceKey;
        samConfig.Resources[resourceKey].Properties.Handler = `app.${handlerComponents[1]}`;
        this.samConfigs.push({ buildRoot, entryPointName, outFile: `./${buildRoot}/${resourceKey}/app.js`, projectKey, samConfig });
      }
    }
  }

  public entry() {
    // Reset the entry points and launch config
    this.entryPoints = {};
    this.launchConfig = {
      version: "0.2.0",
      configurations: []
    };
    this.samConfigs = [];

    for (const projectKey in this.options.projects) {
      const projectTemplate = this.options.projects[projectKey];

      const template = fs.statSync(projectTemplate).isFile() ? projectTemplate : this.templateName(fs.realpathSync(projectTemplate));

      if (template === null) {
        // This works because only this.templateName() should return null
        throw new Error(`Could not find ${AwsSamPlugin.defaultTemplates.join(" or ")} in ${projectTemplate}`);
      }

      this.entryFor(projectKey, template);
    }

    return this.entryPoints;
  }

  public filename(chunkData: any) {
    const samConfig = this.samConfigs.find(c => c.entryPointName === chunkData.chunk.name);
    if (!samConfig) {
      throw new Error(`Unable to find filename for ${chunkData.chunk.name}`);
    }
    return samConfig.outFile;
  }

  public apply(compiler: any) {
    compiler.hooks.afterEmit.tap("SamPlugin", (_compilation: any) => {
      if (this.samConfigs && this.launchConfig) {
        for (const samConfig of this.samConfigs) {
          fs.writeFileSync(`${samConfig.buildRoot}/template.yaml`, yamlDump(samConfig.samConfig));
        }
        if (this.options.vscodeDebug) {
          if (!fs.existsSync(".vscode")) {
            fs.mkdirSync(".vscode");
          }
          fs.writeFileSync(".vscode/launch.json", JSON.stringify(this.launchConfig, null, 2));
        }
      } else {
        console.log("It looks like SamPlugin.entry() was not called");
      }
    });
  }
}

export = AwsSamPlugin;
