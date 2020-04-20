const fs = jest.genMockFromModule("fs") as any;

interface FileMap {
  [fname: string]: string;
}

let mockDirs: string[] = [];
fs.__setMockDirs = (dirs: string[]) => {
  mockDirs = dirs;
}

let mockFiles: FileMap = {};
fs.__setMockFiles = (files: FileMap) => {
  mockFiles = files;
}

let mockRealPaths: FileMap = {};
fs.__setMockRealPaths = (realPaths: FileMap) => {
  mockRealPaths = realPaths;
}

let mockWrittenFiles: FileMap = {};
fs.__getMockWrittenFiles = (): FileMap => {
  return mockWrittenFiles;
}

let mockMakeDirs: string[] = [];
fs.__getMockMakedirs = (): string[] => {
  return mockMakeDirs;
}
fs.__clearMocks = (): void => {
  mockDirs = [];
  mockFiles = {};
  mockRealPaths = {};
  mockWrittenFiles = {};
  mockMakeDirs = [];
}

fs.existsSync = (name: string): boolean => {
  if (name in mockFiles || `./${name}` in mockFiles) {
    return true;
  }
  if (mockDirs.includes(name)) {
    return true;
  }
  return false;
};

fs.mkdirSync = (name: string): void => {
  mockMakeDirs.push(name);
}

fs.readFileSync = (name: string): string => {
  if (name in mockFiles) {
    return mockFiles[name];
  }
  if (mockFiles[`./${name}`]) {
    return mockFiles[`./${name}`];
  }
  throw new Error(`Unknown file ${name}`);
}

fs.realpathSync = (name: string) => {
  if (name in mockRealPaths) {
    return mockRealPaths[name];
  }
  if (`./${name}` in mockRealPaths) {
    return mockRealPaths[`./${name}`];
  }
  throw new Error(`Unknown realpath ${name}`);
}

fs.statSync = (name: string) => {
  if (name in mockFiles) {
    return { isFile: () => true };
  }
  if (`./${name}` in mockFiles) {
    return { isFile: () => true };
  }
  if (mockDirs.includes(name)) {
    return { isFile: () => false };
  }
  throw new Error(`Unknown file ${name}`);
}

fs.writeFileSync = (name: string, contents: string): void => {
  mockWrittenFiles[name] = contents;
}

module.exports = fs;
