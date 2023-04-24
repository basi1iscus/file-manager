import path from "node:path";
import fs from "node:fs/promises";

import { getFileName } from "./utils.js";
import { fileExist } from "./fs.js";
import { errorsMsg } from "./config.js";

export const up = (workingDirectory, restArg) => {
  if (restArg.length !== 0) {
    throw Error(errorsMsg.invalidInput);
  }
  return path.dirname(workingDirectory);
};

export const cd = async (workingDirectory, [dir, ...restArg]) => {
  if (restArg.length !== 0 || !dir) {
    throw Error(errorsMsg.invalidInput);
  }

  const newDir = getFileName(workingDirectory, dir);
  try {
    if ((await fs.stat(newDir)).isDirectory()) {
      return newDir;
    }
    throw Error(errorsMsg.operationFailed);
  } catch {
    throw Error(errorsMsg.operationFailed);
  }
};

export const ls = async (workingDirectory, [dir, ...restArg]) => {
  if (restArg.length !== 0) {
    throw Error(errorsMsg.invalidInput);
  }
  try {
    if (dir) {
      if (!fileExist((workingDirectory = getFileName(workingDirectory, dir)))) {
        throw Error(`${errorsMsg.operationFailed}: Dir not found`);
      }
    }
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
    throw Error(
      `${errorsMsg.operationFailed}: Error getting directory content`
    );
  }
};
