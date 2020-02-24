import {
  mkdirSync,
  readdirSync,
  readFileSync,
  removeSync,
  statSync,
  writeFileSync
} from "fs-extra";
import * as toml from "toml";
import { get_file_path } from "./string-functions";

export const read_file_smart = (filepath: string): string => {
  // reads the file in the location specified in the input and errors if the file cannot be read
  let str: string;
  try {
    str = readFileSync(filepath, "utf8");
  } catch {
    console.error(`Cannot read file '${filepath}'.`);
    process.exit();
  }
  return str;
};

export const write_file_smart = (text: string, filename: string): void => {
  make_sure_folder(get_file_path(filename));
  try {
    writeFileSync(filename, text, {});
  } catch {
    console.error(`Could not write to '${filename}'.`);
    process.exit();
  }
};

// parses a string as TOML with some helping functions to fix syntax mistakes
export const read_toml_smart = (str: string): object => {
  try {
    return toml.parse(str);
  } catch (e) {
    console.error(
      `Parsing error on line ${e.line}, column ${e.column}: ${e.message}`
    );
  }
};

export const path_to_list_of_files = (folder_path: string): string[] => {
  // lists all the files in a directory

  const list_of_paths: string[] = readdirSync(folder_path);
  // select only the files (not directories)
  const list_of_files: string[] = [];
  for (const path of list_of_paths) {
    if (statSync(folder_path + path).isFile()) {
      list_of_files.push(path);
    }
  }
  return list_of_files;
};

const make_sure_folder = (folder_path: string): void => {
  mkdirSync(folder_path, { recursive: true });
};

export const delete_folder = (folder_path: string): void => {
  // deletes a folder
  removeSync(folder_path, {});
};
