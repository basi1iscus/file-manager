import os from "node:os";

import * as nwdCmd from "./nwd.js";
import * as fsCmd from "./fs.js";
import * as osCmd from "./os.js";
import * as zipCmd from "./zip.js";
import * as hashCmd from "./hash.js";

let workingDirectory = os.homedir();

const canChageWorkDirMap = {
  up: nwdCmd.up,
  cd: nwdCmd.cd,
};

const neededWorkDirMap = {
  ls: nwdCmd.ls,
  cat: fsCmd.cat,
  add: fsCmd.add,
  rn: fsCmd.rn,
  cp: fsCmd.cp,
  mv: fsCmd.mv,
  rm: fsCmd.rm,
  hash: hashCmd.hash,
  compress: zipCmd.compress,
  decompress: zipCmd.decompress,
};

const otherMap = {
  os: osCmd.osCmd,
};

export const waitCommand = async (rl, exit) => {
  console.log(`\x1b[34mYou are currently in ${workingDirectory}\x1b[97m`);
  for await (const commandLine of rl) {
    const [command, ...args] = commandLine.match(/".[^"]+"|[^" ]+/gm);

    if (typeof canChageWorkDirMap[command] !== "undefined") {
      try {
        workingDirectory = await canChageWorkDirMap[command](
          workingDirectory,
          args
        );
      } catch (err) {
        console.error(`\x1b[91m${err.message}`);
      }
    } else if (typeof neededWorkDirMap[command] !== "undefined") {
      try {
        await neededWorkDirMap[command](workingDirectory, args);
      } catch (err) {
        console.error(`\x1b[91m${err.message}`);
      }
    } else if (typeof otherMap[command] !== "undefined") {
      try {
        await otherMap[command](args);
      } catch (err) {
        console.error(`\x1b[91m${err.message}`);
      }
    } else if (command === ".exit") {
      exit();
      process.exit(0);
    } else {
      console.error(`\x1b[91mInvalid input`);
    }

    console.log(`\x1b[34mYou are currently in ${workingDirectory}\x1b[97m`);
  }
};
