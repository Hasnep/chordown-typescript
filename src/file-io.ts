import {
  readFileSync,
  writeFileSync,
  readdirSync,
  mkdirSync,
  removeSync
} from "fs-extra";
import * as yaml from "js-yaml";
import { get_file_path } from "./string-functions";

export function get_filename(): string {
  // gets the name of the file passed as a commandline argument
  let n_args = process.argv.length;
  if (n_args > 2) {
    let filename = process.argv[n_args - 1];
    return filename;
  } else {
    return "";
  }
}

export function read_file_smart(filepath: string): string {
  // reads the file in the location specified in the input and errors if the file cannot be read
  let str: string;
  try {
    str = readFileSync(filepath, "utf8");
  } catch (err) {
    console.error(`Cannot read file '${filepath}'.`);
  }
  return str;
}

export function write_file_smart(text: string, filename: string): void {
  make_sure_folder(get_file_path(filename));
  try {
    writeFileSync(filename, text, {});
  } catch (err) {
    console.error(`Could not write to '${filename}'.`);
  }
}

export function read_yaml_smart(str: string): object {
  // parses a string as YAML with some helping functions to fix syntax mistakes
  str = str.replace(/(^.*?):(?=\S)/gm, "$1: "); // add a space after a colon if needed
  return yaml.safeLoad(str);
}

export function path_to_list_of_files(folder_path: string): string[] {
  return readdirSync(folder_path);
}

function make_sure_folder(folder_path: string): void {
  mkdirSync(folder_path, { recursive: true });
}

export function delete_folder(folder_path: string): void {
  removeSync(folder_path, {});
}
