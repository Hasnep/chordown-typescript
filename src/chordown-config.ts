import * as path from "path";
import { read_yaml_smart, read_file_smart } from "./file-io";

export function get_commandline_arg(): string {
  return process.argv[0];
}

export interface Config {
  base: string;
  input: string;
  output: ConfigOutput;
}

interface ConfigOutput {
  json?: object;
  txt?: object;
  tex?: object;
  onsong?: object;
}

export function read_config_file(config_path: string): Config {
  let config_string: string = read_file_smart(config_path);
  let chordown_config: Config = { base: "", input: "", output: {} };
  chordown_config = Object.assign(
    chordown_config,
    read_yaml_smart(config_string)
  );
  
  // fix paths
  chordown_config.base = path.normalize(chordown_config.base);
  chordown_config.input = path.normalize(chordown_config.input);
  for (let output_format of Object.keys(chordown_config.output)) {
    chordown_config.output[output_format].path = path.normalize(
      chordown_config.output[output_format].path
    );
  }
  return chordown_config;
}
