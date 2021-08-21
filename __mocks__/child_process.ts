const child_process = jest.genMockFromModule("child_process") as any;

child_process.exec = jest.fn((cmd, cb) => cb({ code: 0 }));
module.exports = child_process;
