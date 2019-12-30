#!/usr/bin/env node

import * as shell from "shelljs";
import { chordown } from "./chordown";
import {
  config_to_file_paths,
  get_commandline_arg,
  IConfig,
  read_config_file,
} from "./config";
import { export_onsong } from "./exporters/onsong";
import { export_plaintext } from "./exporters/plaintext";
import { export_tex } from "./exporters/tex";
import { read_file_smart, write_file_smart } from "./file-io";
import { IChordown } from "./interfaces";

const config_path = get_commandline_arg();
const chordown_config: IConfig = read_config_file(config_path);
const {
  input: input_file_paths,
  output: output_file_paths,
} = config_to_file_paths(chordown_config);

for (let i = 0; i < input_file_paths.length; i++) {
  const input_file_path: string = input_file_paths[i];
  const input_text: string = read_file_smart(input_file_path);
  const chordown_object: IChordown = chordown(input_text);

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
      const latex_compile_command: string = `cd ${chordown_config.base} ${chordown_config.output.tex.path} && ${latex_compiler} output_file_path`;
      console.log(latex_compile_command);
      shell.exec(latex_compile_command, { silent: true });
    }
  }
}
