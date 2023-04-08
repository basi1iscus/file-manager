import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { pipeline } from "node:stream/promises";

import { fileExist } from "./fs-cmd.js";
import { createBrotliCompress, createBrotliDecompress } from "node:zlib";

export const hash = async (workingDirectory, [fileName]) => {
  const fullName = path.join(workingDirectory, file);
  if (!(await fileExist(fullName))) {
    throw Error(`File not exist`);
  }

  return new Promise(async (resolve, reject) => {
    const fileHandle = await fs.open(fullName);
    const hash = createHash("sha256");
    hash.setEncoding("hex");
    fileHandle
      .createReadStream(file)
      .on("close", () => {
        hash.end();
        const hashHex = hash.read();
        console.log(`Hash of ${file} is\n${hashHex}`);
        resolve(hashHex);
      })
      .on("error", (err) => {
        reject(err);
      })
      .pipe(hash);
  });
};

export const compress = async (workingDirectory, [fileName, zipName]) => {
  const fullFileName = path.join(workingDirectory, fileName);
  const fullZipName = path.join(workingDirectory, zipName);

  if (!(await fileExist(fullFileName))) {
    throw Error(`File not exist`);
  } else if (await fileExist(fullZipName)) {
    throw Error(`New file exist`);
  }

  const fileHandle = await fs.open(fullFileName);
  const zipHandle = await fs.open(fullZipName, "w");
  const zip = createBrotliCompress();

  const src = fileHandle.createReadStream();
  const des = zipHandle.createWriteStream();

  return pipeline(src, zip, des).then(() =>
    console.log(`${fileName} successfully compressed to ${zipName}`)
  );
};

export const decompress = async (workingDirectory, [zipName, fileName]) => {
  const fullFileName = path.join(workingDirectory, fileName);
  const fullZipName = path.join(workingDirectory, zipName);

  if (await fileExist(fullFileName)) {
    throw Error(`File not exist`);
  } else if (!(await fileExist(fullZipName))) {
    throw Error(`New file exist`);
  }

  const zipHandle = await fs.open(fullZipName);
  const fileHandle = await fs.open(fullFileName, "w");
  const dzip = createBrotliDecompress();

  const src = zipHandle.createReadStream();
  const des = fileHandle.createWriteStream();

  return pipeline(src, dzip, des).then(() =>
    console.log(`${zipName} successfully decompressed to ${fileName}`)
  );
};
