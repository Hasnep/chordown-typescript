import {
  to_sentence_case,
  first_character,
  split_lines,
  get_file_name
} from "./string-functions";
import {
  read_commandline_args,
  Config,
  args_to_config
} from "./chordown-config";
import { export_plaintext } from "./exporters/export-plaintext";
import {
  write_file_smart,
  path_to_list_of_files,
  read_file_smart,
  read_yaml_smart
} from "./file-io";
import { export_onsong } from "./exporters/export-onsong";
import { export_tex } from "./exporters/export-tex";
import * as shell from "shelljs";
import * as path from "path";

export function chordown(inupt_text: string): Chordown {
  let { header, body } = separate_header(split_lines(inupt_text));
  return {
    header: parse_header(header.join("\n")),
    body: parse_body(body.join("\n"))
  };
}

export interface Chordown {
  header: Header;
  body: Section[];
}

export interface Header {
  title: string;
  subtitle?: string;
  key?: string;
  artist?: string;
  tempo?: number;
  time?: string;
  transpose?: number | string;
  capo?: number;
  columns?: number;
}

export interface Section {
  name: string;
  repeats: number;
  lines: Line[];
}

export interface Line {
  chords: string[];
  lyrics: string[];
}

function config_to_file_paths(
  config: Config
): { input: string[]; output: object } {
  let input_folder_path: string = path.join(config.base, config.input);
  let input_file_paths: string[];
  try {
    input_file_paths = path_to_list_of_files(config.base + config.input);
  } catch (err) {
    console.error(`Cannot read folder '${input_folder_path}'.`);
    process.exit();
  } finally {
    // convert relative path to absolute path
    input_file_paths = input_file_paths.map(path => input_folder_path + path);
  }

  let file_names = input_file_paths.map(path => get_file_name(path));

  let output_file_paths = {};
  for (let output_format of Object.keys(config.output)) {
    output_file_paths[output_format] = file_names.map(
      file_name =>
        config.base +
        config.output[output_format] +
        file_name +
        "." +
        output_format
    );
  }
  return { input: input_file_paths, output: output_file_paths };
}
let commandline_args = read_commandline_args();
let chordown_config = args_to_config(commandline_args);
let {
  input: input_file_paths,
  output: output_file_paths
} = config_to_file_paths(chordown_config);

for (let i = 0; i < input_file_paths.length; i++) {
  let input_file_path: string = input_file_paths[i];
  let input_text: string = read_file_smart(input_file_path);
  let chordown_object: Chordown = chordown(input_text);

  // export
  let output_formats: string[] = Object.keys(chordown_config.output);
  // plaintext export
  if (output_formats.includes("txt")) {
    let output_file_path: string = output_file_paths["txt"][i];
    write_file_smart(export_plaintext(chordown_object), output_file_path);
  }
  // json export
  if (output_formats.includes("json")) {
    let output_file_path: string = output_file_paths["json"][i];
    write_file_smart(JSON.stringify(chordown_object), output_file_path);
  }
  // onsong export
  if (output_formats.includes("onsong")) {
    let output_file_path: string = output_file_paths["onsong"][i];
    write_file_smart(export_onsong(chordown_object), output_file_path);
  }
  // tex export
  if (output_formats.includes("tex")) {
    let output_file_path: string = output_file_paths["tex"][i];
    write_file_smart(export_tex(chordown_object), output_file_path);
    let latex_compile_command: string =
      "cd " +
      chordown_config.base +
      chordown_config.output["tex"] +
      " && latexmk -xelatex -interaction=nonstopmode " +
      output_file_path;
    console.log(latex_compile_command);
    shell.exec(latex_compile_command, { silent: true });
  }
}
