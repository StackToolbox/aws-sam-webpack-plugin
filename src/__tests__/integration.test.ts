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
    Runtime: nodejs10.x

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
`;

describe("Find the template name", () => {
  test("will find a template.yaml", () => {
    const plugin = new SamPlugin();

    // @ts-ignore
    fs.__setMockFiles({ "./template.yaml": "something" });

    expect(plugin.findTemplateName(".")).toBe("./template.yaml");
  });

  test("will find a template.yml", () => {
    const plugin = new SamPlugin();

    // @ts-ignore
    fs.__setMockFiles({ "./template.yml": "something" });

    expect(plugin.findTemplateName(".")).toBe("./template.yml");
  });

  test("will find nothing", () => {
    const plugin = new SamPlugin();

    // @ts-ignore
    fs.__setMockFiles({});

    expect(plugin.findTemplateName(".")).toBeNull();
  });
});

test("Happy path with default constructor works", () => {
  const plugin = new SamPlugin();

  // @ts-ignore
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "/project/template.yaml": samTemplate });
  // @ts-ignore
  fs.__setMockRealPaths({ ".": "/project" });

  // @ts-ignore
  path.__setMockBasenames({ "/project/template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "/project/template.yaml": "/project" });
  // @ts-ignore
  path.__setMockRelatives({ ".#/project": "" });

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
  fs.__setMockDirs(["."]);
  // @ts-ignore
  fs.__setMockFiles({ "/project/template.yaml": samTemplate });
  // @ts-ignore
  fs.__setMockRealPaths({ ".": "/project" });

  // @ts-ignore
  path.__setMockBasenames({ "/project/template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "/project/template.yaml": "/project" });
  // @ts-ignore
  path.__setMockRelatives({ ".#/project": "" });

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

test("Happy path with multiple projects works", () => {
  const plugin = new SamPlugin({ projects: { a: "project-a", b: "project-b" } });

  // @ts-ignore
  fs.__setMockDirs(["project-a", "project-b"]);
  // @ts-ignore
  fs.__setMockFiles({ "/project-a/template.yaml": samTemplate, "/project-b/template.yaml": samTemplate });
  // @ts-ignore
  fs.__setMockRealPaths({ "project-a": "/project-a", "project-b": "/project-b" });

  // @ts-ignore
  path.__setMockBasenames({ "/project-a/template.yaml": "template.yaml", "/project-b/template.yaml": "template.yaml" });
  // @ts-ignore
  path.__setMockDirnames({ "/project-a/template.yaml": "/project-a", "/project-b/template.yaml": "/project-b" });
  // @ts-ignore
  path.__setMockRelatives({ ".#/project-a": "project-a", ".#/project-b": "project-b" });

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
