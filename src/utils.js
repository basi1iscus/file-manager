import path from "node:path";
import { colors } from "./config.js";

export const info = (message) => {
  console.log(`${colors.info}${message}`);
};

export const error = (message) => {
  console.log(`${colors.error}${message}`);
};

export const prompt = (message) => {
  console.log(`${colors.prompt}${message}${colors.command}`);
};

export const greetings = (message) => {
  console.log(`${colors.greetings}${message}`);
};

export const getFileName = (currentDir, fileName) => {
  if (path.isAbsolute(fileName)) {
    return fileName;
  }

  return path.resolve(currentDir, fileName);
};
