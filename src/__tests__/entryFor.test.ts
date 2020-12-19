import SamPlugin from "../index";

describe("Function Runtime", () => {
  test("must be set if there is no PackageType", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
`;
    expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
      "MyLambda has an unsupport Runtime. Must be nodejs10.x or nodejs12.x"
    );
  });

  test("is not required if there is a PackageType set Globally", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    PackageType: image

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("is not required if there is a PackageType set Globally", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      PackageType: image
      CodeUri: src/my-lambda
      Handler: app.handler
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set globally to nodejs10.x", () => {
    const plugin = new SamPlugin();
    const template = `
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
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set globally to nodejs12.x", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs12.x

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set at the function to nodejs10.x", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs10.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set at the function to nodejs12.x", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs12.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("must be set globally or at the function", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
`;
    expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
      "MyLambda has an unsupport Runtime. Must be nodejs10.x or nodejs12.x"
    );
  });

  test("must have a valid value if set globally", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs8.x

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
`;
    expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
      "MyLambda has an unsupport Runtime. Must be nodejs10.x or nodejs12.x"
    );
  });

  test("must have a valid value if set at the function", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs8.x
`;
    expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
      "MyLambda has an unsupport Runtime. Must be nodejs10.x or nodejs12.x"
    );
  });

  test("can be set global and at function", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs8.x

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs12.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });
});

describe("Function Handler", () => {
  test("can be set globally", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Handler: app.handler

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Runtime: nodejs12.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set at the function", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs12.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set global and at function", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Handler: app.globalHandler

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs12.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("must be set", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Runtime: nodejs12.x
`;
    expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
      "MyLambda is missing a Handler"
    );
  });
});

describe("Function CodeUri", () => {
  test("can be set globally", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    CodeUri: src/my-lambda

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.handler
      Runtime: nodejs12.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set at the function", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs12.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set global or at the function", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    CodeUri: src/my-lambda

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs12.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("must be set", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      Handler: app.handler
      Runtime: nodejs12.x
`;
    expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
      "MyLambda is missing a CodeUri"
    );
  });
});

test("Fails if Properties is missing", () => {
  const plugin = new SamPlugin();
  const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
`;
  expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
    "MyLambda is missing Properties"
  );
});

test("Fails if Hanlde doesn't include a '.'", () => {
  const plugin = new SamPlugin();
  const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      Handler: apphandler
      Runtime: nodejs12.x
`;
  expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
    'MyLambda Handler must contain exactly one "."'
  );
});

test("Allows Inline code with warning", () => {
  const plugin = new SamPlugin();
  const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      InlineCode: src/my-lambda
      Handler: app.handler
      Runtime: nodejs12.x
`;
  const originalLog = console.log;
  console.log = jest.fn();
  const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
  //   expect(entries).toMatchSnapshot();
  expect(console.log).toBeCalledWith(
    "WARNING: This plugin does not compile inline code. The InlineCode for 'MyLambda' will be copied 'as is'."
  );
  console.log = originalLog;
});

describe("Launch config name", () => {
  test("is not prefixed when the projectKey is 'default'", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");

    expect(entries.launchConfigs[0].name).toEqual("MyLambda");
  });

  test("is prefixed when the projectKey isn't 'default'", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("xxx", "", "template.yaml", template, "app");

    expect(entries.launchConfigs[0].name).toEqual("xxx:MyLambda");
  });
});

describe("SAM config entryPointName:", () => {
  test("is not prefixed when the projectKey isn 'default'", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");

    expect(entries.samConfigs[0].entryPointName).toEqual("MyLambda");
  });

  test("is prefixed when the projectKey isn't 'default'", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("xxx", "", "template.yaml", template, "app");

    expect(entries.samConfigs[0].entryPointName).toEqual("xxx#MyLambda");
  });
});

describe("When the template is in a subfolder", () => {
  test("it should match the happy snapshot", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("xxx", "xxx", "template.yaml", template, "app");

    expect(entries).toMatchSnapshot();
  });

  test("it sets the entryPoint correctly", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("xxx", "xxx", "template.yaml", template, "app");
    expect(entries.entryPoints["xxx#MyLambda"]).toEqual("./xxx/src/my-lambda/app");
  });

  test("it sets the launch config localRoot correctly", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("xxx", "xxx", "template.yaml", template, "app");
    expect(entries.launchConfigs[0].localRoot).toEqual("${workspaceFolder}/xxx/.aws-sam/build/MyLambda");
  });

  test("it sets the SAM config builtRoot correctly", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("xxx", "xxx", "template.yaml", template, "app");
    expect(entries.samConfigs[0].buildRoot).toEqual("xxx/.aws-sam/build");
  });

  test("it sets the SAM config outFile correctly", () => {
    const plugin = new SamPlugin();
    const template = `
  AWSTemplateFormatVersion: "2010-09-09"
  Transform: AWS::Serverless-2016-10-31
  
  Globals:
    Function:
      Runtime: nodejs12.x
  
  Resources:
    MyLambda:
      Type: AWS::Serverless::Function
      Properties:
        CodeUri: src/my-lambda
        Handler: app.handler
  `;
    const entries = plugin.entryFor("xxx", "xxx", "template.yaml", template, "app");
    expect(entries.samConfigs[0].outFile).toEqual("./xxx/.aws-sam/build/MyLambda/app.js");
  });
});

test("It ignores non AWS::Serverless::Function resosurces", () => {
  const plugin = new SamPlugin();
  const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs10.x

  FakeResource:
    Type: AWS::FakeResource::NahNah
`;
  const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
  expect(entries).toMatchSnapshot();
});

test("JS output files uses outFile parameter", () => {
  const plugin = new SamPlugin();
  const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs12.x

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
`;
  const entries = plugin.entryFor("default", "", "template.yaml", template, "index");
  expect(entries).toMatchSnapshot();
});
