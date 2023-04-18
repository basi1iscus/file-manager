import * as ReadLine from "node:readline/promises";

import { waitCommand } from "./console-prompt.js";

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

const args = parseArgs();
const userName = args.username
  ? args.username.charAt(0).toUpperCase() + args.username.slice(1)
  : "unknown";

console.log(`\x1b[33mWelcome to the File Manager, ${userName}!`);

const rl = ReadLine.createInterface({
  input: process.stdin,
});

waitCommand(rl, exit);

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
