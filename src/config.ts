import * as path from "path";
import * as yargs from "yargs";
import { path_to_list_of_files, read_file_smart, read_yaml_smart } from "./file-io";

export function get_commandline_arg(): string {
  return yargs.argv._[0];
}

export interface IConfig {
  base: string;
  input: string;
  output: IConfigOutputs;
}

export interface IConfigOutputs {
  json?: object;
  txt?: object;
  tex?: ITeXConfigOutput;
  onsong?: object;
}

export interface IConfigOutput {
  path: string;
}

export interface ITeXConfigOutput {
  path: string;
  compile?: string;
}

export function read_config_file(config_path: string): IConfig {
  const config_string: string = read_file_smart(config_path);
  let chordown_config: IConfig = { base: "", input: "", output: {} };
  chordown_config = Object.assign(chordown_config, read_yaml_smart(config_string));

  // fix paths
  chordown_config.base = path.normalize(chordown_config.base);
  chordown_config.input = path.normalize(chordown_config.input);
  for (const output_format of Object.keys(chordown_config.output)) {
    chordown_config.output[output_format].path = path.normalize(chordown_config.output[output_format].path);
  }
  return chordown_config;
}

export function config_to_file_paths(config: IConfig): { input: string[]; output: any } {
  const input_folder_path: string = path.join(config.base, config.input);
  let input_file_paths: string[];
  try {
    input_file_paths = path_to_list_of_files(config.base + config.input);
  } catch {
    console.error(`Cannot read folder '${input_folder_path}'.`);
    process.exit();
  }

  // convert relative path to absolute path
  input_file_paths = input_file_paths.map((file_path) => path.join(input_folder_path, file_path));

  const file_names = input_file_paths.map((path) => get_file_name(path));
  const output_file_paths = {};
  for (const output_format of Object.keys(config.output)) {
    output_file_paths[output_format] = file_names.map((file_name) =>
      path.join(config.base, config.output[output_format].path, file_name + "." + output_format),
    );
  }
  return { input: input_file_paths, output: output_file_paths };
}
