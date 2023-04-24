import fs from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";

import { fileExist } from "./fs.js";
import { info, getFileName } from "./utils.js";
import { errorsMsg } from "./config.js";

export const compress = async (
  workingDirectory,
  [fileName, zipName, ...restArg]
) => {
  if (restArg.length !== 0 || !fileName || !zipName) {
    throw Error(errorsMsg.invalidInput);
  }

  const fullFileName = getFileName(workingDirectory, fileName);
  const fullZipName = getFileName(workingDirectory, zipName);

  if (!(await fileExist(fullFileName))) {
    throw Error(`${errorsMsg.operationFailed}: File not exist`);
  } else if (await fileExist(fullZipName)) {
    throw Error(`${errorsMsg.operationFailed}: New file exist`);
  }

  try {
    const fileHandle = await fs.open(fullFileName);
    const zipHandle = await fs.open(fullZipName, "w");
    const zip = createBrotliCompress();

    const src = fileHandle.createReadStream();
    const des = zipHandle.createWriteStream();

    return pipeline(src, zip, des).then(() =>
      info(`${fileName} successfully compressed to ${zipName}`)
    );
  } catch (err) {
    throw Error(errorsMsg.operationFailed);
  }
};

export const decompress = async (
  workingDirectory,
  [zipName, fileName, ...restArg]
) => {
  if (restArg.length !== 0 || !fileName || !zipName) {
    throw Error(errorsMsg.invalidInput);
  }
  const fullFileName = getFileName(workingDirectory, fileName);
  const fullZipName = getFileName(workingDirectory, zipName);

  if (await fileExist(fullFileName)) {
    throw Error(`${errorsMsg.operationFailed}: File not exist`);
  } else if (!(await fileExist(fullZipName))) {
    throw Error(`${errorsMsg.operationFailed}: New file exist`);
  }

  try {
    const zipHandle = await fs.open(fullZipName);
    const fileHandle = await fs.open(fullFileName, "w");
    const dzip = createBrotliDecompress();

    const src = zipHandle.createReadStream();
    const des = fileHandle.createWriteStream();

    return pipeline(src, dzip, des).then(() =>
      info(`${zipName} successfully decompressed to ${fileName}`)
    );
  } catch (err) {
    throw Error(errorsMsg.operationFailed);
  }
};
