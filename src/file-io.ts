import { mkdirSync, readdirSync, readFileSync, removeSync, statSync, writeFileSync } from "fs-extra";
import * as yaml from "js-yaml";
import { get_file_path } from "./string-functions";

export function read_file_smart(filepath: string): string {
  // reads the file in the location specified in the input and errors if the file cannot be read
  let str: string;
  try {
    str = readFileSync(filepath, "utf8");
  } catch {
    console.error(`Cannot read file '${filepath}'.`);
    process.exit();
  }
  return str;
}

export function write_file_smart(text: string, filename: string): void {
  make_sure_folder(get_file_path(filename));
  try {
    writeFileSync(filename, text, {});
  } catch {
    console.error(`Could not write to '${filename}'.`);
    process.exit();
  }
}

export function read_yaml_smart(str: string): object {
  // parses a string as YAML with some helping functions to fix syntax mistakes
  str = str.replace(/(^.*?):(?=\S)/gm, "$1: "); // add a space after a colon if needed
  return yaml.safeLoad(str);
}

export function path_to_list_of_files(folder_path: string): string[] {
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
}

function make_sure_folder(folder_path: string): void {
  mkdirSync(folder_path, { recursive: true });
}

export function delete_folder(folder_path: string): void {
  // deletes a folder
  removeSync(folder_path, {});
}
