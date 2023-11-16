import SamPlugin from "../index";
import fs from "fs";
import path from "path";

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
      },
    },
  });
  // @ts-ignore
  afterEmit(null);

  // @ts-ignore
  expect({ entryPoints, files: fs.__getMockWrittenFiles() }).toMatchSnapshot();
});
