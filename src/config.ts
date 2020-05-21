import * as path from "path";
import * as yargs from "yargs";
import {
  path_to_list_of_files,
  read_file_smart,
  read_toml_smart
} from "./file-io";
import { get_file_name } from "./string-functions";

export const get_commandline_arg = (): string => {
  return yargs.argv._[0];
};

export interface IConfig {
  input?: IConfigInput;
  output?: IConfigOutputs;
}

interface IConfigInput {
  path: string;
}

export interface IConfigOutputs {
  json?: IConfigOutput;
  txt?: IConfigOutput;
  tex?: ITeXConfigOutput;
  onsong?: IConfigOutput;
}

export interface IConfigOutput {
  path: string;
}

export interface ITeXConfigOutput {
  path: string;
  compile?: string;
}

export const read_config_file = (config_path: string): IConfig => {
  const config_string: string = read_file_smart(config_path);
  let chordown_config: IConfig = { input: { path: "" }, output: {} };
  chordown_config = Object.assign(
    chordown_config,
    read_toml_smart(config_string)
  );

  // fix paths
  chordown_config.input.path = path.normalize(chordown_config.input.path);
  for (const output_format of Object.keys(chordown_config.output)) {
    chordown_config.output[output_format].path = path.normalize(
      chordown_config.output[output_format].path
    );
  }
  return chordown_config;
};

export const config_to_file_paths = (
  config: IConfig
): { input: string[]; output: IConfigOutputs } => {
  const input_folder_path: string = path.join(config.input.path);
  let input_file_paths: string[];
  try {
    input_file_paths = path_to_list_of_files(config.input.path);
  } catch {
    console.error(`Cannot read folder '${input_folder_path}'.`);
    process.exit();
  }

  // convert relative path to absolute path
  input_file_paths = input_file_paths.map((file_path) =>
    path.join(input_folder_path, file_path)
  );

  const file_names = input_file_paths.map((path) => get_file_name(path));
  const output_file_paths = {};
  for (const output_format of Object.keys(config.output)) {
    output_file_paths[output_format] = file_names.map((file_name) =>
      path.join(
        config.output[output_format].path,
        file_name + "." + output_format
      )
    );
  }
  return { input: input_file_paths, output: output_file_paths };
};

const deduplicate = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const combine_configs = (
  first_config: object | string | number,
  second_config: object | string | number
): object | string | number => {
  const type_a = typeof first_config;
  const type_b = typeof second_config;

  if (type_a !== "object" && type_b !== "object") {
    return second_config;
  } else if (type_a == "object" && type_b == "object") {
    const all_keys = deduplicate([
      ...Object.keys(first_config),
      ...Object.keys(second_config)
    ]);
    const output = {};
    all_keys.forEach((key) => {
      const first_has_key = Object.prototype.hasOwnProperty.call(
        first_config,
        key
      );
      const second_has_key = Object.prototype.hasOwnProperty.call(
        second_config,
        key
      );
      if (first_has_key && second_has_key) {
        output[key] = combine_configs(first_config[key], second_config[key]);
      } else if (first_has_key && !second_has_key) {
        output[key] = first_config[key];
      } else if (!first_has_key && second_has_key) {
        output[key] = second_config[key];
      } else {
        output[key] = null;
      }
    });
    return output;
  } else if (type_a !== type_b) {
    return first_config;
  }
};
