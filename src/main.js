import os from "node:os";
import * as ReadLine from "node:readline/promises";
import * as fsCmd from "./fs-cmd.js";
import * as utilsCmd from "./utils-cmd.js";

let workingDirectory = os.homedir();

const fsCommandMap = {
  up: fsCmd.up,
  cd: fsCmd.cd,
  ls: fsCmd.ls,
  cat: fsCmd.cat,
  add: fsCmd.add,
  rn: fsCmd.rn,
  cp: fsCmd.cp,
  mv: fsCmd.mv,
  rm: fsCmd.rm,
};

const osCommandMap = {
  os: (param) => {},
};

const utilsCommandMap = {
  hash: utilsCmd.hash,
  compress: utilsCmd.compress,
  decompress: utilsCmd.decompress,
};

const parseArgs = () => {
  const args = process.argv.reduce((acc, item) => {
    if (item.startsWith("--")) {
      const [key, value] = item.split("=");
      if (key.length > 2) {
        try {
          acc[key.slice(2)] = value ?? "";
        } catch {
          console.log(`Incorrect argument ${key}`);
        }
      }
    }
    return acc;
  }, {});

  return args;
};

const waitCommand = async (rl) => {
  console.log(`You are currently in ${workingDirectory}`);
  for await (const commandLine of rl) {
    const [command, ...args] = commandLine
      .trim()
      .replace(/\s+/g, " ")
      .split(" ");

    if (typeof fsCommandMap[command] !== "undefined") {
      try {
        await fsCommandMap[command](workingDirectory, args);
      } catch {
        console.log(`Invalid input`);
      }
    } else if (typeof osCommandMap[command] !== "undefined") {
      try {
        await osCommandMap[command](args);
      } catch {
        console.log(`Invalid input`);
      }
    } else if (typeof utilsCommandMap[command] !== "undefined") {
      try {
        await utilsCommandMap[command](workingDirectory, args);
      } catch {
        console.log(`Invalid input`);
      }
    } else {
      console.log(`Invalid input`);
    }

    console.log(`You are currently in ${workingDirectory}`);
  }
};

const args = parseArgs();
const userName = args.username
  ? args.username.charAt(0).toUpperCase() + args.username.slice(1)
  : "unknown";

console.log(`Welcome to the File Manager, ${userName}!`);

const rl = ReadLine.createInterface({
  input: process.stdin,
});

waitCommand(rl);

process.on("SIGINT", () => {
  rl.close();
  console.log();
  console.log(`Thank you for using File Manager, ${userName}, goodbye!`);
});
