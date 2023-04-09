import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import * as ReadLine from "node:readline/promises";
import * as fsCmd from "./fs-cmd.js";
import * as osCmd from "./os-cmd.js";
import * as utilsCmd from "./utils-cmd.js";

export const up = (restArg) => {
  if (restArg.length !== 0) {
    throw Error(`Invalid input`);
  }
  const currentDir = path.dirname(workingDirectory);
  workingDirectory = currentDir;
};

export const cd = async ([dir, ...restArg]) => {
  if (restArg.length !== 0) {
    throw Error(`Invalid input`);
  }
  const newDir = path.join(workingDirectory, dir);
  try {
    if ((await fs.stat(newDir)).isDirectory()) {
      workingDirectory = newDir;
      return;
    } else {
      throw Error(`Operation failed`);
    }
  } catch {
    throw Error(`Operation failed`);
  }
};

export const ls = async (restArg) => {
  if (restArg.length !== 0) {
    throw Error(`Invalid input`);
  }
  try {
    const dirContent = await fs
      .readdir(workingDirectory, { withFileTypes: true })
      .then((direntArr) =>
        direntArr
          .sort((a, b) =>
            a.isDirectory() === b.isDirectory()
              ? a.name.localeCompare(b.name)
              : a.isDirectory() < b.isDirectory()
              ? +1
              : -1
          )
          .map((dirent) => {
            return {
              Name: dirent.name,
              Type: dirent.isDirectory() ? "directory" : "file",
            };
          })
      );

    console.table(dirContent);
  } catch (err) {
    throw Error(`Error getting directory content`);
  }
};

const exitCmd = (restArg) => {
  if (restArg.length !== 0) {
    throw Error(`Invalid input`);
  }
  exit();
  process.exit(0);
};

let workingDirectory = os.homedir();

const mainCommandMap = {
  ".exit": exitCmd,
  up: up,
  cd: cd,
  ls: ls,
};

const fsCommandMap = {
  cat: fsCmd.cat,
  add: fsCmd.add,
  rn: fsCmd.rn,
  cp: fsCmd.cp,
  mv: fsCmd.mv,
  rm: fsCmd.rm,
};

const osCommandMap = {
  os: osCmd.osCmd,
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
          console.error(`\x1b[91mIncorrect argument ${key}`);
        }
      }
    }
    return acc;
  }, {});

  return args;
};

const waitCommand = async (rl) => {
  console.log(`\x1b[34mYou are currently in ${workingDirectory}\x1b[97m`);
  for await (const commandLine of rl) {
    const [command, ...args] = commandLine.match(/".[^"]+"|\b[^"\s]+/gm);

    if (typeof fsCommandMap[command] !== "undefined") {
      try {
        await fsCommandMap[command](workingDirectory, args);
      } catch (err) {
        console.error(`\x1b[91m${err.message}`);
      }
    } else if (typeof osCommandMap[command] !== "undefined") {
      try {
        await osCommandMap[command](args);
      } catch (err) {
        console.error(`\x1b[91m${err.message}`);
      }
    } else if (typeof utilsCommandMap[command] !== "undefined") {
      try {
        await utilsCommandMap[command](workingDirectory, args);
      } catch (err) {
        console.error(`\x1b[91m${err.message}`);
      }
    } else if (typeof mainCommandMap[command] !== "undefined") {
      try {
        await mainCommandMap[command](args);
      } catch (err) {
        console.error(`\x1b[91m${err.message}`);
      }
    } else {
      console.error(`\x1b[91mInvalid input`);
    }

    console.log(`\x1b[34mYou are currently in ${workingDirectory}\x1b[97m`);
  }
};

const args = parseArgs();
const userName = args.username
  ? args.username.charAt(0).toUpperCase() + args.username.slice(1)
  : "unknown";

console.log(`\x1b[33mWelcome to the File Manager, ${userName}!`);

const rl = ReadLine.createInterface({
  input: process.stdin,
});

waitCommand(rl);

function exit() {
  rl.close();
  console.log(
    `\x1b[33mThank you for using File Manager, ${userName}, goodbye!\x1b[97m`
  );
}

process.on("SIGINT", () => {
  console.log();
  exit();
});
