import fs from "node:fs/promises";
import { createHash } from "node:crypto";

import { fileExist } from "./fs.js";
import { info, getFileName } from "./utils.js";
import { errorsMsg } from "./config.js";

export const hash = async (workingDirectory, [fileName, ...restArg]) => {
  if (restArg.length !== 0 || !fileName) {
    throw Error(errorsMsg.invalidInput);
  }
  const file = getFileName(workingDirectory, fileName);
  if (!(await fileExist(file))) {
    throw Error(`${errorsMsg.operationFailed}: File not exist`);
  }

  return new Promise(async (resolve, reject) => {
    const fileHandle = await fs.open(file);
    const hash = createHash("sha256");
    hash.setEncoding("hex");
    fileHandle
      .createReadStream()
      .on("close", () => {
        hash.end();
        const hashHex = hash.read();
        info(`Hash of ${fileName} is\n${hashHex}`);
        resolve();
      })
      .on("error", (err) => {
        reject(Error(errorsMsg.operationFailed));
      })
      .pipe(hash);
  });
};
