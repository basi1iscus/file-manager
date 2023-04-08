import path from "node:path";
import fs from "node:fs/promises";
import { constants } from "node:fs";
import { pipeline } from "node:stream/promises";

export const fileExist = async (fileName) => {
  return fs
    .access(fileName, constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

export const up = (workingDirectory) => {
  const currentDir = path.dirname(workingDirectory);
  workingDirectory = currentDir;
  return workingDirectory;
};

export const cd = async (workingDirectory, [dir]) => {
  const newDir = path.join(workingDirectory, dir);
  try {
    if ((await fs.stat(newDir)).isDirectory()) {
      workingDirectory = newDir;
      return workingDirectory;
    } else {
      throw Error(`${dir} is not directory`);
    }
  } catch {
    throw Error(`Error changing directory`);
  }
};

export const ls = async (workingDirectory) => {
  try {
    const dirContent = await fs
      .readdir(workingDirectory, { withFileTypes: true })
      .then((direntArr) =>
        direntArr.map((dirent) => {
          return {
            Name: dirent.name,
            Type: dirent.isDirectory() ? "directory" : "file",
          };
        })
      );

    console.table(dirContent);
  } catch {
    throw Error(`Error getting directory content`);
  }
};

export const cat = async (workingDirectory, [file]) => {
  const fileName = path.join(workingDirectory, file);
  if (await fileExist(fileName)) {
    return new Promise(async (resolve, reject) => {
      const fileHandle = await fs.open(fileName);
      fileHandle
        .createReadStream()
        .on("close", () => {
          resolve();
        })
        .on("error", (err) => {
          reject(err);
        })
        .pipe(process.stdout)
        .on("error", (err) => {
          reject(err);
        });
    });
  } else {
    throw Error(`Error changing directory`);
  }
};

export const add = async (workingDirectory, [fileName]) => {
  const file = path.join(workingDirectory, fileName);
  if (!(await fileExist(file))) {
    return fs
      .writeFile(file, "")
      .then(() => console.log(`\x1b[32m${file} successfully created`));
  } else {
    throw Error(`Same file exist`);
  }
};

export const rn = async (workingDirectory, [oldFileName, newFileName]) => {
  const oldFile = path.join(workingDirectory, oldFileName);
  const newFile = path.join(workingDirectory, newFileName);
  if (!(await fileExist(oldFile))) {
    throw Error(`File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`New file exist`);
  }

  return fs
    .rename(oldFile, newFile)
    .then(() =>
      console.log(
        `\x1b[32m${oldFileName} successfully renamed to ${newFileName}`
      )
    );
};

export const cp = async (workingDirectory, [oldFileName, newFileName]) => {
  const oldFile = path.join(workingDirectory, oldFileName);
  const newFile = path.join(workingDirectory, newFileName);
  if (!(await fileExist(oldFile))) {
    throw Error(`File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`New file exist`);
  }

  const oldHandle = await fs.open(oldFile);
  const newHandle = await fs.open(newFile, "w");

  const src = oldHandle.createReadStream();
  const des = newHandle.createWriteStream();

  return pipeline(src, des).then(() =>
    console.log(`\x1b[32m${oldFileName} successfully copied to ${newFileName}`)
  );
};

export const mv = async (workingDirectory, [oldFileName, newFileName]) => {
  const oldFile = path.join(workingDirectory, oldFileName);
  const newFile = path.join(workingDirectory, newFileName);
  if (!(await fileExist(oldFile))) {
    throw Error(`File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`New file exist`);
  }

  const oldHandle = await fs.open(oldFile);
  const newHandle = await fs.open(newFile, "w");

  const src = oldHandle.createReadStream();
  const des = newHandle.createWriteStream();

  return pipeline(src, des).then(() => {
    fs.rm(oldFile);
    console.log(`\x1b[32m${oldFileName} successfully moved to ${newFileName}`);
  });
};

export const rm = async (workingDirectory, [file]) => {
  const fileName = path.join(workingDirectory, file);
  if (!(await fileExist(fileName))) {
    throw Error(`File not exist`);
  }

  return fs
    .rm(fileName)
    .then(() => console.log(`\x1b[32m${file} successfully deleted`));
};
