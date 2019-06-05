import {
  to_sentence_case,
  first_character,
  split_lines,
  get_file_name
} from "./string-functions";
import { read_commandline_args, args_to_config } from "./chordown-config";
import { export_plaintext } from "./exporters/export-plaintext";
import {
  write_file_smart,
  path_to_list_of_files,
  read_file_smart,
  read_yaml_smart
} from "./file-io";
import { Config } from "./chordown-config";
import { export_onsong } from "./exporters/export-onsong";
import { export_tex } from "./exporters/export-tex";
import * as shell from "shelljs";
import "path";

export const line_blank: number = 0;
export const line_text: number = 1;
export const line_chord: number = 2;
export const line_section: number = 3;

// checking linetypes
export function is_line_blank(line: string): boolean {
  return first_character(line.trim()) == "";
}

export function is_line_chord(line: string): boolean {
  return first_character(line.trim()) == ":";
}

export function is_line_section(line: string): boolean {
  return first_character(line.trim()) == "#";
}

export function get_linetype(line: string): number {
  if (is_line_blank(line)) {
    return line_blank;
  } else if (is_line_chord(line)) {
    return line_chord;
  } else if (is_line_section(line)) {
    return line_section;
  } else {
    return line_text;
  }
}

export function separate_header(
  lines: string[]
): { header: string[]; body: string[] } {
  // given a list of lines, finds the header and splits into header and body
  if (lines[0] == "---") {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i] == "---") {
        return {
          header: lines.slice(1, i),
          body: lines.slice(i + 1)
        };
      }
    }
  }
  console.warn("Did not contain a header.");
  return { header: [], body: lines };
}

// parsing lines
export function parse_header(header_text: string): Header {
  if (header_text == "") {
    return { title: "" };
  } else {
    header_text = header_text.replace(/(^.*?):(?=\S)/gm, "$1: "); // fix bad yaml
    let header: Header = { title: "" };

    header = Object.assign(header, read_yaml_smart(header_text));
    // if ("title"! in header) {
    //   console.warn("KEEP THIS CODE");
    //   header["title"] = "";
    //   return header;
    // }
    return header;
  }
}

export function parse_line_chord(line: string): string[] {
  let line_splitted: string[] = line
    .trim()
    .slice(1)
    // .trim()
    .match(/\S+/g);
  if (line_splitted == null) {
    return [];
  } else {
    return line_splitted;
  }
}

export function parse_line_text(line: string): string[] {
  return line.replace(/\s+/, " ").split("^");
}

export function parse_line_section(line: string): string {
  line = line
    .trim()
    .slice(1)
    .trim();
  if (line.slice(-1) == ":") {
    line = line.slice(0, -1).trim();
  }
  line = to_sentence_case(line);
  // // check if final character of section is a number
  // if (parseInt(line.slice(-1)[0]) == NaN) {
  //   // if the final character is a number then remove it
  //   line = line.slice(0, -2);
  // }
  return line;
}

export function parse_body(body: string): Section[] {
  let body_parsed: Section[] = []; // initialise output object

  // initialise variables
  let current_section: Section = {
    name: null,
    repeats: null,
    lines: []
  };
  let current_line: Line = {
    chords: null,
    lyrics: null
  };

  // loop over each line
  for (let line of split_lines(body)) {
    switch (get_linetype(line)) {
      case line_blank:
        break;
      case line_section:
        // if the current line has content, push it
        if (current_line.chords != null || current_line.lyrics != null) {
          current_section.lines.push(current_line);
          current_line = {
            chords: null,
            lyrics: null
          }; // reset the curent line
        }
        // push the current section if it's not the default undefined section
        if (current_section != undefined) {
          body_parsed.push(current_section);
        }
        // start a new section
        current_section = {
          name: parse_line_section(line),
          repeats: null,
          lines: []
        };
        break;
      case line_chord:
        // if the current line has lyrics or chords, push it
        if (current_line.chords != null || current_line.lyrics != null) {
          current_section.lines.push(current_line);
          current_line = {
            chords: null,
            lyrics: null
          };
        }
        // replace the current line's chords
        current_line.chords = parse_line_chord(line);
        break;
      case line_text:
        // if the current line has lyrics, push it
        if (current_line.lyrics != null) {
          current_section.lines.push(current_line);
          current_line = {
            chords: null,
            lyrics: null
          };
        }
        // replace the current line's lyrics
        current_line.lyrics = parse_line_text(line);

        // temp check for consisten lengths
        if (current_line.chords != null) {
          if (current_line.chords.length + 1 != current_line.lyrics.length) {
            console.error(
              "something bad happened on this line: " +
                current_line.lyrics.join("")
            );
          }
        }

        break;
    }
  }
  // push final line if it hasn't been pushed yet
  if (current_line.chords != null || current_line.lyrics != null) {
    current_section.lines.push(current_line);
    current_line = {
      chords: null,
      lyrics: null
    };
  }
  // push the final section
  body_parsed.push(current_section);
  return body_parsed;
}

export function chordown(inupt_text: string): Chordown {
  // read_file(get_filename())

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
  columns?:number;
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
  let input_folder_path: string = path.join(config.base , config.input);
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

  let file_names = input_file_paths.map(
    path => get_file_name(path) //.replace(/-/g, " ")
  );

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
