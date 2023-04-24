import os from "node:os";

import { info } from "./utils.js";
import { errorsMsg } from "./config.js";

const eol = () => {
  const eolDesciption = os.EOL.split("")
    .map((s) => `<${s.charCodeAt(0)}>`)
    .join("");
  info(`Default system End-Of-Line is ${eolDesciption}`);
};

const homedir = () => {
  info(`Home directory is ${os.homedir}`);
};

const username = () => {
  info(`System user name is ${os.userInfo().username}`);
};

const cpus = () => {
  const cpuArr = os.cpus();
  info(`There are ${cpuArr.length} overall cpus`);
  cpuArr.forEach((cpu) => {
    info(`Model: ${cpu.model}, clock rate: ${cpu.speed / 1000} GHz`);
  });
};

const architecture = () => {
  info(`Node.js binary architecture is ${os.arch}`);
};

export const osCmd = async (_, [osCmd, ...restArg]) => {
  if (restArg.length !== 0 || !osCmd) {
    throw Error(errorsMsg.invalidInput);
  }

  const osMap = {
    "--EOL": eol,
    "--cpus": cpus,
    "--homedir": homedir,
    "--username": username,
    "--architecture": architecture,
  };

  if (typeof osMap[osCmd] === "undefined") {
    throw Error(errorsMsg.invalidInput);
  }
  try {
    osMap[osCmd]();
    return;
  } catch (err) {
    throw Error(errorsMsg.operationFailed);
  }
};
