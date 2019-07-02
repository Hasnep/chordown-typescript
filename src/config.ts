import * as path from "path";
import * as yargs from "yargs";
import { read_file_smart, read_yaml_smart } from "./file-io";

export function get_commandline_arg(): string {
  return yargs.argv._[0];
}

export interface IConfig {
  base: string;
  input: string;
  output: IConfigOutput;
}

interface IConfigOutput {
  json?: object;
  txt?: object;
  tex?: object;
  onsong?: object;
}

export function read_config_file(config_path: string): IConfig {
  const config_string: string = read_file_smart(config_path);
  let chordown_config: IConfig = { base: "", input: "", output: {} };
  chordown_config = Object.assign(
    chordown_config,
    read_yaml_smart(config_string),
  );

  // fix paths
  chordown_config.base = path.normalize(chordown_config.base);
  chordown_config.input = path.normalize(chordown_config.input);
  for (const output_format of Object.keys(chordown_config.output)) {
    chordown_config.output[output_format].path = path.normalize(
      chordown_config.output[output_format].path,
    );
  }
  return chordown_config;
}
