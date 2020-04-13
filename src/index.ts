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

interface SamConfig {
  buildRoot: string;
  entryPointName: string;
  outFile: string;
  projectKey: string;
  samConfig: any;
  templateName: string;
}

interface IEntryForResult {
  entryPoints: IEntryPointMap;
  launchConfigs: any[];
  samConfigs: SamConfig[];
}

class AwsSamPlugin {
  private static defaultTemplates = ["template.yaml", "template.yml"];
  private launchConfig: any;
  private options: AwsSamPluginOptions;
  private samConfigs: SamConfig[];

  constructor(options?: Partial<AwsSamPluginOptions>) {
    this.options = {
      projects: { default: "." },
      vscodeDebug: true,
      ...options,
    };
    this.samConfigs = [];
  }

  // Returns the name of the SAM template file or null if it's not found
  private findTemplateName(prefix: string) {
    for (const f of AwsSamPlugin.defaultTemplates) {
      const template = `${prefix}/${f}`;
      if (fs.existsSync(template)) {
        return template;
      }
    }

    return null;
  }

  // Returns a webpack entry object based on the SAM template
  public entryFor(projectKey: string, projectPath: string, projectTemplateName: string, projectTemplate: string): IEntryForResult {
    const entryPoints: IEntryPointMap = {};
    const launchConfigs: any[] = [];
    const samConfigs: SamConfig[] = [];

    const samConfig = yamlParse(projectTemplate);

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
        if (!["nodejs10.x", "nodejs12.x"].includes(properties.Runtime ?? defaultRuntime)) {
          throw new Error(`${resourceKey} has an unsupport Runtime. Must be nodejs10.x or nodejs12.x`);
        }

        // Continue with a warning if they're using inline code
        if (properties.InlineCode) {
          console.log(
            `WARNING: This plugin does not compile inline code. The InlineCode for '${resourceKey}' will be copied 'as is'.`
          );
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

        const basePathPrefix = projectPath === "" ? "." : `./${projectPath}`;
        const basePath = codeUri ? `${basePathPrefix}/${codeUri}` : `${basePathPrefix}`;
        const fileBase = `${basePath}/${handlerComponents[0]}`;

        const buildRoot = projectPath === "" ? `.aws-sam/build` : `${projectPath}/.aws-sam/build`;
        // Generate the launch config for the VS Code debugger
        launchConfigs.push({
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
          sourceMaps: true,
        });

        // Add the entry point for webpack
        const entryPointName = projectKey === "default" ? resourceKey : `${projectKey}#${resourceKey}`;
        entryPoints[entryPointName] = fileBase;
        samConfig.Resources[resourceKey].Properties.CodeUri = resourceKey;
        samConfig.Resources[resourceKey].Properties.Handler = `app.${handlerComponents[1]}`;
        samConfigs.push({
          buildRoot,
          entryPointName,
          outFile: `./${buildRoot}/${resourceKey}/app.js`,
          projectKey,
          samConfig,
          templateName: projectTemplateName,
        });
      }
    }

    return { entryPoints, launchConfigs, samConfigs };
  }

  public entry() {
    // Reset the entry points and launch config
    let allEntryPoints: IEntryPointMap = {};
    this.launchConfig = {
      version: "0.2.0",
      configurations: [],
    };
    this.samConfigs = [];

    // Loop through each of the "projects" from the options
    for (const projectKey in this.options.projects) {
      // The value will be the name of a folder or a template file
      const projectFolderOrTemplateName = this.options.projects[projectKey];

      // If the projectFolderOrTemplateName isn't a file then we should look for common template file names
      const projectTemplateName = fs.statSync(projectFolderOrTemplateName).isFile()
        ? projectFolderOrTemplateName
        : this.findTemplateName(projectFolderOrTemplateName);

      // If we still cannot find a project template name then throw an error because something is wrong
      if (projectTemplateName === null) {
        throw new Error(`Could not find ${AwsSamPlugin.defaultTemplates.join(" or ")} in ${projectFolderOrTemplateName}`);
      }

      // Retrieve the entry points, VS Code debugger launch configs and SAM config for this entry
      const { entryPoints, launchConfigs, samConfigs } = this.entryFor(
        projectKey,
        path.relative(".", path.dirname(projectTemplateName)),
        path.basename(projectTemplateName),
        fs.readFileSync(projectTemplateName).toString()
      );

      // Addd them to the entry pointsm launch configs and SAM confis we've already discovered.
      allEntryPoints = {
        ...allEntryPoints,
        ...entryPoints,
      };
      this.launchConfig.configurations = [...this.launchConfig.configurations, ...launchConfigs];
      this.samConfigs = [...this.samConfigs, ...samConfigs];
    }

    // Once we're done return the entry points
    return allEntryPoints;
  }

  public filename(chunkData: any) {
    const samConfig = this.samConfigs.find((c) => c.entryPointName === chunkData.chunk.name);
    if (!samConfig) {
      throw new Error(`Unable to find filename for ${chunkData.chunk.name}`);
    }
    return samConfig.outFile;
  }

  public apply(compiler: any) {
    compiler.hooks.afterEmit.tap("SamPlugin", (_compilation: any) => {
      if (this.samConfigs && this.launchConfig) {
        for (const samConfig of this.samConfigs) {
          fs.writeFileSync(`${samConfig.buildRoot}/${samConfig.templateName}`, yamlDump(samConfig.samConfig));
        }
        if (this.options.vscodeDebug !== false) {
          if (!fs.existsSync(".vscode")) {
            fs.mkdirSync(".vscode");
          }
          fs.writeFileSync(".vscode/launch.json", JSON.stringify(this.launchConfig, null, 2));
        }
      } else {
        throw new Error("It looks like AwsSamPlugin.entry() was not called");
      }
    });
  }
}

export = AwsSamPlugin;
