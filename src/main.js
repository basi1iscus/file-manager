import os from "node:os";
import * as ReadLine from "node:readline/promises";
import * as fsCmd from "./fs-cmd.js";
import * as osCmd from "./os-cmd.js";
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
    const [command, ...args] = commandLine
      .trim()
      .replace(/\s+/g, " ")
      .split(" ");

    if (typeof fsCommandMap[command] !== "undefined") {
      try {
        const answer = await fsCommandMap[command](workingDirectory, args);
        if (typeof answer === "string") {
          workingDirectory = answer;
        }
      } catch {
        console.error(`\x1b[91mInvalid input`);
      }
    } else if (typeof osCommandMap[command] !== "undefined") {
      try {
        await osCommandMap[command](args);
      } catch {
        console.error(`\x1b[91mInvalid input`);
      }
    } else if (typeof utilsCommandMap[command] !== "undefined") {
      try {
        await utilsCommandMap[command](workingDirectory, args);
      } catch {
        console.error(`\x1b[91mInvalid input`);
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

process.on("SIGINT", () => {
  rl.close();
  console.log();
  console.log(
    `\x1b[33mThank you for using File Manager, ${userName}, goodbye!\x1b[97m`
  );
});
