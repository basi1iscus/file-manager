import * as nwdCmd from "./nwd.js";
import * as fsCmd from "./fs.js";
import * as osCmd from "./os.js";
import * as zipCmd from "./zip.js";
import * as hashCmd from "./hash.js";
import { exit } from "./main.js";

const SET_COLOR = "\x1b[";

export const colors = {
  prompt: SET_COLOR + "34m",
  error: SET_COLOR + "91m",
  command: SET_COLOR + "97m",
  info: SET_COLOR + "32m",
  greetings: SET_COLOR + "33m",
};

export const errorsMsg = {
  invalidInput: "Invalid input",
  operationFailed: "Operation failed",
  incorrectArgument: "Incorrect argument",
};

export const commandsMap = {
  up: nwdCmd.up,
  cd: nwdCmd.cd,
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
  os: osCmd.osCmd,
  ".exit": exit,
};
