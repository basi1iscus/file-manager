import path from "node:path";
import fs from "node:fs/promises";

export const up = (workingDirectory, restArg) => {
  if (restArg.length !== 0) {
    throw Error(`Invalid input`);
  }
  return path.dirname(workingDirectory);
};

export const cd = async (workingDirectory, [dir, ...restArg]) => {
  if (restArg.length !== 0) {
    throw Error(`Invalid input`);
  }
  const newDir = path.join(workingDirectory, dir);
  try {
    if ((await fs.stat(newDir)).isDirectory()) {
      return newDir;
    } else {
      throw Error(`Operation failed`);
    }
  } catch {
    throw Error(`Operation failed`);
  }
};

export const ls = async (workingDirectory, restArg) => {
  if (restArg.length !== 0) {
    throw Error(`Invalid input`);
  }
  try {
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

    return workingDirectory;
  } catch (err) {
    throw Error(`Error getting directory content`);
  }
};
