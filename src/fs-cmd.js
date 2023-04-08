import path from "node:path";
import fs from "node:fs/promises";
import { constants } from "node:fs";

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
          resolve(true);
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

export const add = async (workingDirectory, [file]) => {
  const fileName = path.join(workingDirectory, file);
  if (!(await fileExist(fileName))) {
    fs.writeFile(fileName, "");
    return fileName;
  } else {
    throw Error(`File exist`);
  }
};

export const rn = async (workingDirectory, [oldName, newName]) => {
  const oldFile = path.join(workingDirectory, oldName);
  const newFile = path.join(workingDirectory, newName);
  if (!(await fileExist(oldFile))) {
    throw Error(`File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`New file exist`);
  }

  fs.rename(oldFile, newFile);
  return newFile;
};

export const cp = async (workingDirectory, [oldFileName, newFileName]) => {
  const oldFile = path.join(workingDirectory, oldFileName);
  const newFile = path.join(workingDirectory, newFileName);
  if (!(await fileExist(oldFile))) {
    throw Error(`File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`New file exist`);
  }

  return new Promise(async (resolve, reject) => {
    const oldFileHandle = await fs.open(oldFile);
    const newFileHandle = await fs.open(newFile, "w");
    oldFileHandle
      .createReadStream()
      .on("close", () => {
        resolve(true);
      })
      .on("error", (err) => {
        reject(err);
      })
      .pipe(
        newFileHandle.createWriteStream().on("error", (err) => {
          reject(err);
        })
      );
  });
};

export const mv = async (workingDirectory, [oldFileName, newFileName]) => {
  const oldFile = path.join(workingDirectory, oldFileName);
  const newFile = path.join(workingDirectory, newFileName);
  if (!(await fileExist(oldFile))) {
    throw Error(`File not exist`);
  } else if (await fileExist(newFile)) {
    throw Error(`New file exist`);
  }

  return new Promise(async (resolve, reject) => {
    const oldFileHandle = await fs.open(oldFile);
    const newFileHandle = await fs.open(newFile, "w");
    oldFileHandle
      .createReadStream()
      .on("close", () => {
        resolve(true);
      })
      .on("error", (err) => {
        reject(err);
      })
      .pipe(
        newFileHandle.createWriteStream().on("error", (err) => {
          reject(err);
        })
      );
  }).then(() => {
    fs.rm(oldFile);
  });
};

export const rm = async (workingDirectory, [file]) => {
  const fileName = path.join(workingDirectory, file);
  if (!(await fileExist(fileName))) {
    throw Error(`File not exist`);
  }

  fs.rm(fileName);
  return fileName;
};
