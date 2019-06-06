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
  return chordown_config;
}
