import * as ReadLine from "node:readline/promises";

import { waitCommand } from "./prompt.js";
import { greetings, error } from "./utils.js";
import { errorsMsg } from "./config.js";

const parseArgs = () => {
  const args = process.argv.reduce((acc, item) => {
    if (item.startsWith("--")) {
      const [key, value] = item.split("=");
      if (key.length > 2) {
        try {
          acc[key.slice(2)] = value ?? "";
        } catch {
          error(`${errorsMsg.incorrectArgument} ${key}`);
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

greetings(`Welcome to the File Manager, ${userName}!`);

const rl = ReadLine.createInterface({
  input: process.stdin,
});

waitCommand(rl);

export function exit() {
  rl.close();
  greetings(`Thank you for using File Manager, ${userName}, goodbye!`);
  process.exit(0);
}

process.on("SIGINT", () => {
  console.log();
  exit();
});
