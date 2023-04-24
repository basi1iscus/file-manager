import os from "node:os";
import { commandsMap, errorsMsg } from "./config.js";
import { error, prompt } from "./utils.js";

let workingDirectory = os.homedir();

export const waitCommand = async (rl, exit) => {
  prompt(`You are currently in ${workingDirectory}`);
  for await (const commandLine of rl) {
    const [command, ...args] = commandLine.match(/".[^"]+"|[^" ]+/gm);

    if (typeof commandsMap[command] !== "undefined") {
      try {
        const result = await commandsMap[command](workingDirectory, args);
        if (result instanceof Error) {
          throw result;
        }
        if (typeof newDirectory === "string") {
          workingDirectory = newDirectory;
        }
      } catch (err) {
        error(err.message);
      }
    } else {
      error(errorsMsg.invalidInput);
    }

    prompt(`You are currently in ${workingDirectory}`);
  }
};
