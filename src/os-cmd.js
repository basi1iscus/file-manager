import os from "node:os";

const eol = () => {
  const eolDesciption = os.EOL.split("")
    .map((s) => `<${s.charCodeAt(0)}>`)
    .join("");
  console.log(`\x1b[32mDefault system End-Of-Line is ${eolDesciption}`);
};

const homedir = () => {
  console.log(`\x1b[32mHome directory is ${os.homedir}`);
};

const username = () => {
  console.log(`\x1b[32mSystem user name is ${os.userInfo().username}`);
};

const cpus = () => {
  const cpuArr = os.cpus();
  console.log(`\x1b[32mThere are ${cpuArr.length} overall cpus`);
  cpuArr.forEach((cpu) => {
    console.log(`Model: ${cpu.model}, clock rate: ${cpu.speed / 1000} GHz`);
  });
};

const architecture = () => {
  console.log(`\x1b[32mNode.js binary architecture is ${os.arch}`);
};

export const osCmd = async ([arg]) => {
  const osMap = {
    "--EOL": eol,
    "--cpus": cpus,
    "--homedir": homedir,
    "--username": username,
    "--architecture": architecture,
  };

  if (typeof osMap[arg] !== "undefined") {
    try {
      return osMap[arg]();
    } catch (err) {
      throw Error(`Error ${err.message}`);
    }
  }

  throw Error(`Invalid argument {$arg}`);
};
