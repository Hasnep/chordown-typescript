import { read_yaml_smart, read_file_smart } from "./file-io";
import * as yargs from "yargs";
import { get_file_extenstion } from "./string-functions";

interface Args {
  config?: string;
  base?:string;
  input?: string;
  output?: string;
}

export function read_commandline_args(): Args {
  // wrapper for yargs to get arguments passed through the command line
  return yargs
    .option("config", {
      alias: "c",
      description: "path to config file",
      demand: false
    })
    .option("base", {
      alias: "b",
      demand: false,
      description: "base path"
    })
    .option("input", {
      alias: "i",
      demand: false,
      description: "path to input file relative to --base"
    })
    .option("output", {
      alias: "o",
      demand: false,
      description: "output file path relative to --base"
    }).argv;
}

export interface Config {
  base: string;
  input: string;
  output: output_paths;
}

interface output_paths {
  json?: object;
  txt?: object;
  tex?: object;
  onsong?: object;
}

export function args_to_config(args: Args): Config {
  // input an object of command line arguments and get a config object
  let chordown_config: Config = { base: "", input: null, output: null };

  if (args.hasOwnProperty("config")) {
    // check if conflicting arguments have been specified
    if (args.hasOwnProperty("base")) {
      console.log(
        "The '--base' argument will be overwitten by the '--config' argument."
      );
    }
    if (args.hasOwnProperty("input")) {
      console.log(
        "The '--input' argument will be overwitten by the '--config' argument."
      );
    }
    if (args.hasOwnProperty("output")) {
      console.log(
        "The '--output' argument will be overwitten by the '--config' argument."
      );
    }

    // read the config file and copy the properties over
    let config_text: string = read_file_smart(args.config);
    let config_file_config: object = read_yaml_smart(config_text);
    chordown_config = Object.assign(chordown_config, config_file_config);
    // console.log(chordown_config);
    
  } else {
    // if a config file has not been specified
    if (args.hasOwnProperty("base")) {
      chordown_config.base = args.base;
    }
    if (args.hasOwnProperty("input")) {
      chordown_config.input = args.input;
    }
    if (args.hasOwnProperty("output")) {
    let  output_format = get_file_extenstion(args.output);
      chordown_config.output[output_format] = args.output;
    }
  }
  return chordown_config;
}
