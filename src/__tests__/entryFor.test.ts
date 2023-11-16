import SamPlugin from "../index";

describe("Function Runtime", () => {
  test("can be set globally to nodejs14.x", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs14.x

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

  test("can be set globally to nodejs16.x", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs16.x

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

  test("can be set globally to nodejs18.x", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs18.x

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

  test("can be set globally to nodejs20.x", () => {
    const plugin = new SamPlugin();
    const template = `
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
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set at the function to nodejs14.x", () => {
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
      Runtime: nodejs14.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set at the function to nodejs16.x", () => {
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
      Runtime: nodejs16.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set at the function to nodejs18.x", () => {
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
      Runtime: nodejs18.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });

  test("can be set at the function to nodejs20.x", () => {
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
      Runtime: nodejs20.x
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
      "MyLambda has an unsupport Runtime. Must be nodejs14.x, nodejs16.x, nodejs18.x or nodejs20.x"
    );
  });

  test("must have a valid value if set globally", () => {
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
    expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
      "MyLambda has an unsupport Runtime. Must be nodejs14.x, nodejs16.x, nodejs18.x or nodejs20.x"
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
      Runtime: nodejs12.x
`;
    expect(() => plugin.entryFor("default", "", "template.yaml", template, "app")).toThrowError(
      "MyLambda has an unsupport Runtime. Must be nodejs14.x, nodejs16.x, nodejs18.x or nodejs20.x"
    );
  });

  test("can be set global and at function", () => {
    const plugin = new SamPlugin();
    const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs18.x

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs20.x
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries).toMatchSnapshot();
  });
});

test("can be set global and at function", () => {
  const plugin = new SamPlugin();
  const template = `
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs18.x

Resources:
  MyLambda:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/my-lambda
      Handler: app.handler
      Runtime: nodejs20.x
`;
  const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
  expect(entries).toMatchSnapshot();
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x
  
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
      Runtime: nodejs20.x

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
    Runtime: nodejs20.x

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

describe("Property paths are rewritten correctly", () => {
  test("BodyS3Location property for the AWS::ApiGateway::RestApi resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::ApiGateway::RestApi
      Properties:
        BodyS3Location: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.BodyS3Location).toEqual(
      "../../path/to/file"
    );
  });

  test("Code property for the AWS::Lambda::Function resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::Lambda::Function
      Properties:
        Code: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.Code).toEqual("../../path/to/file");
  });

  test("DefinitionS3Location property for the AWS::AppSync::GraphQLSchema resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::AppSync::GraphQLSchema
      Properties:
        DefinitionS3Location: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.DefinitionS3Location).toEqual(
      "../../path/to/file"
    );
  });

  test("RequestMappingTemplateS3Location property for the AWS::AppSync::Resolver resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::AppSync::Resolver
      Properties:
        RequestMappingTemplateS3Location: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(
      entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.RequestMappingTemplateS3Location
    ).toEqual("../../path/to/file");
  });

  test("ResponseMappingTemplateS3Location property for the AWS::AppSync::Resolver resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::AppSync::Resolver
      Properties:
        ResponseMappingTemplateS3Location: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(
      entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.ResponseMappingTemplateS3Location
    ).toEqual("../../path/to/file");
  });

  test("DefinitionUri property for the AWS::Serverless::Api resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::Serverless::Api
      Properties:
        DefinitionUri: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.DefinitionUri).toEqual(
      "../../path/to/file"
    );
  });

  test("Location parameter for the AWS::Include transform", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::Include
      Properties:
        Location: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.Location).toEqual("../../path/to/file");
  });

  test("SourceBundle property for the AWS::ElasticBeanstalk::ApplicationVersion resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::ElasticBeanstalk::ApplicationVersion
      Properties:
        SourceBundle: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.SourceBundle).toEqual(
      "../../path/to/file"
    );
  });

  test("TemplateURL property for the AWS::CloudFormation::Stack resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::CloudFormation::Stack
      Properties:
        TemplateURL: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.TemplateURL).toEqual(
      "../../path/to/file"
    );
  });

  test("Command.ScriptLocation property for the AWS::Glue::Job resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::Glue::Job
      Properties:
        Command:
          ScriptLocation: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.Command?.ScriptLocation).toEqual(
      "../../path/to/file"
    );
  });

  test("DefinitionS3Location property for the AWS::StepFunctions::StateMachine resource", () => {
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
      Runtime: nodejs20.x

  MyResource:
    Type: AWS::StepFunctions::StateMachine
    Properties:
      DefinitionS3Location: path/to/file
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.DefinitionS3Location).toEqual(
      "../../path/to/file"
    );
  });
});

describe("Property paths are not re-written when they are objects", () => {
  test("BodyS3Location property for the AWS::ApiGateway::RestApi resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::ApiGateway::RestApi
      Properties:
        BodyS3Location:
          Bucket: bucketname
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.BodyS3Location).toEqual({
      Bucket: "bucketname",
    });
  });

  test("Code property for the AWS::Lambda::Function resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::Lambda::Function
      Properties:
        Code:
          S3Bucket: bucketname
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.Code).toEqual({
      S3Bucket: "bucketname",
    });
  });

  test("DefinitionS3Location property for the AWS::AppSync::GraphQLSchema resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::AppSync::GraphQLSchema
      Properties:
        DefinitionS3Location: s3://path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.DefinitionS3Location).toEqual(
      "s3://path/to/file"
    );
  });

  test("RequestMappingTemplateS3Location property for the AWS::AppSync::Resolver resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::AppSync::Resolver
      Properties:
        RequestMappingTemplateS3Location: s3://path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(
      entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.RequestMappingTemplateS3Location
    ).toEqual("s3://path/to/file");
  });

  test("ResponseMappingTemplateS3Location property for the AWS::AppSync::Resolver resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::AppSync::Resolver
      Properties:
        ResponseMappingTemplateS3Location: s3://path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(
      entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.ResponseMappingTemplateS3Location
    ).toEqual("s3://path/to/file");
  });

  // TODO
  test("DefinitionUri property for the AWS::Serverless::Api resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::Serverless::Api
      Properties:
        DefinitionUri: path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.DefinitionUri).toEqual(
      "../../path/to/file"
    );
  });

  test("Location parameter for the AWS::Include transform", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::Include
      Properties:
        Location: s3://path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.Location).toEqual("s3://path/to/file");
  });

  test("SourceBundle property for the AWS::ElasticBeanstalk::ApplicationVersion resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::ElasticBeanstalk::ApplicationVersion
      Properties:
        SourceBundle:
          S3Bucket: bucketname
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.SourceBundle).toEqual({
      S3Bucket: "bucketname",
    });
  });

  test("TemplateURL property for the AWS::CloudFormation::Stack resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::CloudFormation::Stack
      Properties:
        TemplateURL: s3://path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.TemplateURL).toEqual(
      "s3://path/to/file"
    );
  });

  test("Command.ScriptLocation property for the AWS::Glue::Job resource", () => {
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
        Runtime: nodejs20.x

    MyResource:
      Type: AWS::Glue::Job
      Properties:
        Command:
          ScriptLocation: s3://path/to/file
  `;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.Command?.ScriptLocation).toEqual(
      "s3://path/to/file"
    );
  });

  test("DefinitionS3Location property for the AWS::StepFunctions::StateMachine resource", () => {
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
      Runtime: nodejs20.x

  MyResource:
    Type: AWS::StepFunctions::StateMachine
    Properties:
      DefinitionS3Location:
        Bucket: bucketname
`;
    const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
    expect(entries.samConfigs[0]?.samConfig?.Resources?.MyResource?.Properties?.DefinitionS3Location).toEqual({
      Bucket: "bucketname",
    });
  });
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
      Runtime: nodejs20.x
`;
  const entries = plugin.entryFor("default", "", "template.yaml", template, "app");
});
