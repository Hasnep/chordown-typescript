import * as path from "path";
import * as shell from "shelljs";
import { get_commandline_arg, IConfig, read_config_file } from "./config";
import { export_onsong } from "./exporters/onsong";
import { export_plaintext } from "./exporters/plaintext";
import { export_tex } from "./exporters/tex";
import {
  path_to_list_of_files,
  read_file_smart,
  write_file_smart,
} from "./file-io";
import { parse_body, parse_header, separate_header } from "./parser";
import { get_file_name, split_lines } from "./string-functions";
import { transpose } from "./transpose";

export interface IChordown {
  header: IHeader;
  body: ISection[];
}

export interface IHeader {
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

export interface ISection {
  name: string;
  repeats: number;
  lines: ILine[];
}

export interface ILine {
  chords: string[];
  lyrics: string[];
}

export function chordown(inupt_text: string): IChordown {
  let { header, body } = separate_header(split_lines(inupt_text));
  if (header == null) {
    header = [""];
  }
  return {
    header: parse_header(header.join("\n")),
    body: parse_body(body.join("\n")),
  };
}

function config_to_file_paths(
  config: IConfig,
): { input: string[]; output: any } {
  const input_folder_path: string = path.join(config.base, config.input);
  let input_file_paths: string[];
  try {
    input_file_paths = path_to_list_of_files(config.base + config.input);
  } catch {
    console.error(`Cannot read folder '${input_folder_path}'.`);
    process.exit();
  }

  // convert relative path to absolute path
  input_file_paths = input_file_paths.map((file_path) =>
    path.join(input_folder_path, file_path),
  );

  const file_names = input_file_paths.map((path) => get_file_name(path));
  const output_file_paths = {};
  for (const output_format of Object.keys(config.output)) {
    output_file_paths[output_format] = file_names.map((file_name) =>
      path.join(
        config.base,
        config.output[output_format].path,
        file_name + "." + output_format,
      ),
    );
  }
  return { input: input_file_paths, output: output_file_paths };
}

const config_path = get_commandline_arg();
const chordown_config: IConfig = read_config_file(config_path);
const {
  input: input_file_paths,
  output: output_file_paths,
} = config_to_file_paths(chordown_config);

for (let i = 0; i < input_file_paths.length; i++) {
  const input_file_path: string = input_file_paths[i];
  const input_text: string = read_file_smart(input_file_path);
  let chordown_object: IChordown = chordown(input_text);
  chordown_object = transpose(chordown_object);

  // export
  const output_formats: string[] = Object.keys(chordown_config.output);
  // plaintext export
  if (output_formats.includes("txt")) {
    const output_file_path: string = output_file_paths.txt[i];
    write_file_smart(export_plaintext(chordown_object), output_file_path);
  }
  // json export
  if (output_formats.includes("json")) {
    const output_file_path: string = output_file_paths.json[i];
    write_file_smart(JSON.stringify(chordown_object), output_file_path);
  }
  // onsong export
  if (output_formats.includes("onsong")) {
    const output_file_path: string = output_file_paths.onsong[i];
    write_file_smart(export_onsong(chordown_object), output_file_path);
  }
  // tex export
  if (output_formats.includes("tex")) {
    const output_file_path: string = output_file_paths.tex[i];
    write_file_smart(
      export_tex(chordown_object, chordown_config),
      output_file_path,
    );
    if (Object.keys(chordown_config.output.tex).includes("compile")) {
      const latex_compiler: string = chordown_config.output.tex.compile;
      const latex_compile_command: string = `cd ${chordown_config.base} ${
        chordown_config.output.tex.path
      } && ${latex_compiler} output_file_path`;
      console.log(latex_compile_command);
      shell.exec(latex_compile_command, { silent: true });
    }
  }
}
