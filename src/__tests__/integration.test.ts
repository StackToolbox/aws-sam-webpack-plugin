import SamPlugin from "../index";
import fs from "fs";
import path from "path";
import child_process from "child_process";

jest.mock("child_process");
jest.mock("fs");
jest.mock("path");

const samTemplate = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs20.x

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
`;
const samTemplateWithLayer = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Globals:
  Function:
    Runtime: nodejs10.x
Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
  LayerSharp:
    Type: AWS::Serverless::LayerVersion
    Metadata:
      BuildMethod: makefile
    Properties:
      LayerName: layer-sharp
      Description: Package sharp
      ContentUri: layers/sharp
      CompatibleRuntimes:
        - nodejs14.x
      RetentionPolicy: Retain
  LayerSharp2:
    Type: AWS::Serverless::LayerVersion
    Metadata:
      BuildMethod: makefile
    Properties:
      LayerName: layer-sharp2
      Description: Package sharp2
      ContentUri: ./layers/sharp2
      CompatibleRuntimes:
        - nodejs14.x
      RetentionPolicy: Retain
`;

test("Happy path with default constructor works", () => {
  const plugin = new SamPlugin();

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "./template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  const entryPoints = plugin.entry();

  let afterEmit: (_compilation: any) => void;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {},
      },
    },
  });
  // @ts-ignore
  afterEmit(null);

  // @ts-ignore
  expect({ entryPoints, files: fs.__getMockWrittenFiles() }).toMatchSnapshot();
});

test("Happy path with empty options in the constructor works", () => {
  const plugin = new SamPlugin({});

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "./template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  const entryPoints = plugin.entry();

  let afterEmit: (_compilation: any) => void;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {},
      },
    },
  });
  // @ts-ignore
  afterEmit(null);

  // Does create a .vscode folder
  // @ts-ignore
  expect(fs.__getMockMakedirs().includes(".vscode")).toBeTruthy();

  // @ts-ignore
  expect({ entryPoints, files: fs.__getMockWrittenFiles() }).toMatchSnapshot();
});

test("Happy path with empty options in the constructor works and an existing .vscode folder", () => {
  const plugin = new SamPlugin({});

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs([".", ".vscode"]);
  // @ts-ignore
  fs.__setMockFiles({ "./template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  const entryPoints = plugin.entry();

  let afterEmit: (_compilation: any) => void;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {},
      },
    },
  });
  // @ts-ignore
  afterEmit(null);

  // Does not create a .vscode folder
  // @ts-ignore
  expect(fs.__getMockMakedirs().includes(".vscode")).toBeFalsy();

  // @ts-ignore
  expect({ entryPoints, files: fs.__getMockWrittenFiles() }).toMatchSnapshot();
});

test("Happy path with VS Code debugging disabled", () => {
  const plugin = new SamPlugin({ vscodeDebug: false });

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "./template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  const entryPoints = plugin.entry();

  let afterEmit: (_compilation: any) => void;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {},
      },
    },
  });
  // @ts-ignore
  afterEmit(null);

  // Does not create a .vscode folder
  // @ts-ignore
  expect(fs.__getMockMakedirs().includes(".vscode")).toBeFalsy();

  // @ts-ignore
  expect({ entryPoints, files: fs.__getMockWrittenFiles() }).toMatchSnapshot();
});

test("Happy path with multiple projects works", () => {
  const plugin = new SamPlugin({ projects: { a: "project-a", b: "project-b" } });

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["project-a", "project-b"]);
  // @ts-ignore
  fs.__setMockFiles({ "project-a/template.yaml": samTemplate, "project-b/template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "project-a/template.yaml": "template.yaml", "project-b/template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "project-a/template.yaml": "project-a", "project-b/template.yaml": "project-b" });
  // @ts-ignore
  path.__setMockRelatives({ ".#project-a": "project-a", ".#project-b": "project-b" });

  const entryPoints = plugin.entry();

  let afterEmit: (_compilation: any) => void;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {},
      },
    },
  });
  // @ts-ignore
  afterEmit(null);

  // @ts-ignore
  expect({ entryPoints, files: fs.__getMockWrittenFiles() }).toMatchSnapshot();
});

test("Happy path with multiple projects and different template names works", () => {
  const plugin = new SamPlugin({ projects: { a: "project-a/template-a.yaml", b: "project-b/template-b.yaml" } });

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["project-a", "project-b"]);
  // @ts-ignore
  fs.__setMockFiles({ "project-a/template-a.yaml": samTemplate, "project-b/template-b.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({
    "project-a/template-a.yaml": "template-a.yaml",
    "project-b/template-b.yaml": "template-b.yaml",
  });
  // @ts-ignore
  path.__setMockDirnames({ "project-a/template-a.yaml": "project-a", "project-b/template-b.yaml": "project-b" });
  // @ts-ignore
  path.__setMockRelatives({ ".#project-a": "project-a", ".#project-b": "project-b" });

  const entryPoints = plugin.entry();

  let afterEmit: (_compilation: any) => void;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {},
      },
    },
  });
  // @ts-ignore
  afterEmit(null);

  // @ts-ignore
  expect({ entryPoints, files: fs.__getMockWrittenFiles() }).toMatchSnapshot();
});

test("Calling apply() before entry() throws an error", () => {
  const plugin = new SamPlugin();

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  path.__clearMocks();

  let afterEmit: (_compilation: any) => void;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {},
      },
    },
  });
  // @ts-ignore
  expect(() => afterEmit(null)).toThrowError("It looks like AwsSamPlugin.entry() was not called");
});

test("Happy path for filename() when the Lambda is found", () => {
  const plugin = new SamPlugin();

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "./template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  const entryPoints = plugin.entry();

  expect(plugin.filename({ chunk: { name: "MyLambda" } })).toEqual("./.aws-sam/build/MyLambda/app.js");
});

test("Fails when filename() is passed an invalid lambda name", () => {
  const plugin = new SamPlugin();

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "./template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  const entryPoints = plugin.entry();

  //console.log("XXX", plugin.filename({chunk: { name: "FakeLambda" }}));
  expect(() => plugin.filename({ chunk: { name: "FakeLambda" } })).toThrowError(
    "Unable to find filename for FakeLambda"
  );
});

test("Fails when there is no template.yaml or template.yml and you provided a directory", () => {
  const plugin = new SamPlugin();

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["."]);
  // // @ts-ignore
  // fs.__setMockFiles({ "./template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  // path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // // @ts-ignore
  // path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  expect(() => plugin.entry()).toThrowError("Could not find template.yaml or template.yml in .");
});

test("Happy path with an output file specified", () => {
  const plugin = new SamPlugin({ outFile: "index" });

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "./template.yaml": samTemplate });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  const entryPoints = plugin.entry();

  let afterEmit: (_compilation: any) => void;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {},
      },
    },
  });
  // @ts-ignore
  afterEmit(null);

  // @ts-ignore
  expect({ entryPoints, files: fs.__getMockWrittenFiles() }).toMatchSnapshot();
});

test("Happy exec make template with layers", async () => {
  const plugin = new SamPlugin({ outFile: "index" });

  // @ts-ignore
  fs.__clearMocks();
  // @ts-ignore
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "./template.yaml": samTemplateWithLayer });

  // @ts-ignore
  path.__clearMocks();
  // @ts-ignore
  path.__setMockBasenames({ "./template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "./template.yaml": "." });
  // @ts-ignore
  path.__setMockRelatives({ ".#.": "" });

  const entryPoints = plugin.entry();

  // let afterEmit: (_compilation: any) => void;
  let afterEmitPromise: (_compilation: any) => Promise<void>;

  plugin.apply({
    hooks: {
      afterEmit: {
        tap: (n: string, f: (_compilation: any) => void) => {
          // afterEmit = f;
        },
        tapPromise: async (n: string, f: (_compilation: any) => Promise<void>) => {
          afterEmitPromise = f;
        },
      },
    },
  });

  const execMocked = child_process.exec as unknown as jest.Mock;
  execMocked.mockClear();
  // @ts-ignore
  await afterEmitPromise(null);

  expect(execMocked.mock.calls.length).toBe(2);
  expect(execMocked.mock.calls[0][0]).toMatch(
    /make -C ".\/layers\/sharp" ARTIFACTS_DIR="[^"]+\/\.aws-sam\/build\/LayerSharp" build-LayerSharp/
  );
  expect(execMocked.mock.calls[1][0]).toMatch(
    /make -C ".\/layers\/sharp2" ARTIFACTS_DIR="[^"]+\/\.aws-sam\/build\/LayerSharp2" build-LayerSharp2/
  );
});
