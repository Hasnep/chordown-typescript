import { split_lines, get_file_name } from "./string-functions";
import { Config, get_commandline_arg, read_config_file } from "./config";
import { export_plaintext } from "./exporters/plaintext";
import {
  write_file_smart,
  path_to_list_of_files,
  read_file_smart
} from "./file-io";
import { export_onsong } from "./exporters/onsong";
import { export_tex } from "./exporters/tex";
import * as shell from "shelljs";
import * as path from "path";
import { separate_header, parse_header, parse_body } from "./parser";

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

export function chordown(inupt_text: string): Chordown {
  let { header, body } = separate_header(split_lines(inupt_text));
  if (header == null) {
    header = [""];
  }
  return {
    header: parse_header(header.join("\n")),
    body: parse_body(body.join("\n"))
  };
}

function config_to_file_paths(
  config: Config
): { input: string[]; output: object } {
  let input_folder_path: string = path.join(config.base, config.input);
  let input_file_paths: string[];
  try {
    input_file_paths = path_to_list_of_files(config.base + config.input);
  } catch {
    console.error(`Cannot read folder '${input_folder_path}'.`);
    process.exit();
  }

  // convert relative path to absolute path
  input_file_paths = input_file_paths.map(file_path =>
    path.join(input_folder_path, file_path)
  );

  let file_names = input_file_paths.map(path => get_file_name(path));
  let output_file_paths = {};
  for (let output_format of Object.keys(config.output)) {
    output_file_paths[output_format] = file_names.map(file_name =>
      path.join(
        config.base,
        config.output[output_format].path,
        file_name + "." + output_format
      )
    );
  }
  return { input: input_file_paths, output: output_file_paths };
}

let config_path = get_commandline_arg();
let chordown_config = read_config_file(config_path);
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
    write_file_smart(
      export_tex(chordown_object, chordown_config),
      output_file_path
    );
    if (
      Object.keys(chordown_config.output.tex).includes("compile") &&
      chordown_config.output.tex["compile"] != false
    ) {
      let latex_compiler = chordown_config.output.tex["compile"];
      let latex_compile_command: string =
        "cd " +
        chordown_config.base +
        chordown_config.output["tex"]["path"] +
        " && " +
        latex_compiler +
        " " +
        output_file_path;
      console.log(latex_compile_command);
      shell.exec(latex_compile_command, { silent: true });
    }
  }
}
