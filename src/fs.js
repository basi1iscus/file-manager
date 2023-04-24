import fs from "node:fs/promises";
import { constants } from "node:fs";
import { pipeline } from "node:stream/promises";

import { info, getFileName } from "./utils.js";
import { errorsMsg } from "./config.js";

export const fileExist = async (fileName) => {
  return fs
    .access(fileName, constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

export const cat = async (workingDirectory, [fileName, ...restArg]) => {
  if (restArg.length !== 0 || !fileName) {
    throw Error(errorsMsg.invalidInput);
  }
  const file = getFileName(workingDirectory, fileName);
  if (!(await fileExist(file))) {
    throw Error(`${errorsMsg.operationFailed}: File not exist`);
  }
  return new Promise((resolve, reject) => {
    const fileHandle = fs
      .open(file)
      .then((fileHandle) =>
        fileHandle
          .createReadStream()
          .on("close", () => {
            console.log();
            resolve();
          })
          .on("error", (err) => {
            reject(Error(errorsMsg.operationFailed));
          })
          .pipe(process.stdout)
          .on("error", (err) => {
            reject(Error(errorsMsg.operationFailed));
          })
      )
      .catch((err) => reject(Error(errorsMsg.operationFailed)));
  });
};

export const add = async (workingDirectory, [fileName, ...restArg]) => {
  if (restArg.length !== 0 || !fileName) {
    throw Error(errorsMsg.invalidInput);
  }
  const file = getFileName(workingDirectory, fileName);
  if (await fileExist(file)) {
    throw Error(`${errorsMsg.operationFailed}: ${fileName} already exist`);
  }
  return fs
    .writeFile(file, "")
    .then(() => info(`${fileName} successfully created`))
    .catch((err) => Error(errorsMsg.operationFailed));
};

export const rn = async (
  workingDirectory,
  [oldFileName, newFileName, ...restArg]
) => {
  if (restArg.length !== 0 || !oldFileName || !newFileName) {
    throw Error(errorsMsg.invalidInput);
  }

  const oldFile = getFileName(workingDirectory, oldFileName);
  const newFile = getFileName(workingDirectory, newFileName);

  if (!(await fileExist(oldFile))) {
    throw Error(`${errorsMsg.operationFailed}: File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`${errorsMsg.operationFailed}: New file exist`);
  }

  return fs
    .rename(oldFile, newFile)
    .then(() => info(`${oldFileName} successfully renamed to ${newFileName}`))
    .catch((err) => Error(errorsMsg.operationFailed));
};

export const cp = async (
  workingDirectory,
  [oldFileName, newFileName, ...restArg]
) => {
  if (restArg.length !== 0 || !oldFileName || !newFileName) {
    throw Error(errorsMsg.invalidInput);
  }
  const oldFile = getFileName(workingDirectory, oldFileName);
  const newFile = getFileName(workingDirectory, newFileName);
  if (!(await fileExist(oldFile))) {
    throw Error(`${errorsMsg.operationFailed}: File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`${errorsMsg.operationFailed}: New file exist`);
  }

  try {
    const oldHandle = await fs.open(oldFile);
    const newHandle = await fs.open(newFile, "w");

    const src = oldHandle.createReadStream();
    const des = newHandle.createWriteStream();

    await pipeline(src, des).then(() =>
      info(`${oldFileName} successfully copied to ${newFileName}`)
    );
  } catch (err) {
    throw Error(errorsMsg.operationFailed);
  }
};

export const mv = async (
  workingDirectory,
  [oldFileName, newFileName, ...restArg]
) => {
  if (restArg.length !== 0 || !oldFileName || !newFileName) {
    throw Error(errorsMsg.invalidInput);
  }
  const oldFile = getFileName(workingDirectory, oldFileName);
  const newFile = getFileName(workingDirectory, newFileName);
  if (!(await fileExist(oldFile))) {
    throw Error(`${errorsMsg.operationFailed}: File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`${errorsMsg.operationFailed}: New file exist`);
  }

  try {
    const oldHandle = await fs.open(oldFile);
    const newHandle = await fs.open(newFile, "w");

    const src = oldHandle.createReadStream();
    const des = newHandle.createWriteStream();

    await pipeline(src, des).then(() => {
      fs.rm(oldFile);
      info(`${oldFileName} successfully moved to ${newFileName}`);
    });
  } catch (err) {
    throw Error(errorsMsg.operationFailed);
  }
};

export const rm = async (workingDirectory, [fileName, ...restArg]) => {
  if (restArg.length !== 0 || !fileName) {
    throw Error(errorsMsg.invalidInput);
  }
  const file = getFileName(workingDirectory, fileName);
  if (!(await fileExist(file))) {
    throw Error(`${errorsMsg.operationFailed}: File not exist`);
  }

  return fs
    .rm(file)
    .then(() => info(`${fileName} successfully deleted`))
    .catch((err) => Error(errorsMsg.operationFailed));
};
