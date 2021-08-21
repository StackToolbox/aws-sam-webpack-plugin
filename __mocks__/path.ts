const path = jest.genMockFromModule("path") as any;

interface PathMap {
  [fname: string]: string;
}

let mockBasename: PathMap = {};
path.__setMockBasenames = (basenames: PathMap) => {
  mockBasename = basenames;
};

let mockDirname: PathMap = {};
path.__setMockDirnames = (dirnames: PathMap) => {
  mockDirname = dirnames;
};

let mockRelative: PathMap = {};
path.__setMockRelatives = (relatives: PathMap) => {
  mockRelative = relatives;
};

path.__clearMocks = (): void => {
  mockBasename = {};
  mockDirname = {};
  mockRelative = {};
};

path.basename = (name: string): string => {
  if (name in mockBasename) {
    return mockBasename[name];
  }
  throw new Error(`Unknown file ${name}`);
};

path.dirname = (name: string): string => {
  if (name in mockDirname) {
    return mockDirname[name];
  }
  throw new Error(`Unknown dirname ${name}`);
};

path.relative = (folder: string, name: string): string => {
  if (`${folder}#${name}` in mockRelative) {
    return mockRelative[`${folder}#${name}`];
  }
  throw new Error(`Unknown relative ${folder}, ${name}`);
};

path.resolve = (folder: string): string => {
  return process.cwd() + "/" + folder;
};

module.exports = path;
