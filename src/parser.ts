import { IHeader, ILine, ISection } from "./interfaces";
import { read_toml_smart } from "./file-io";
import {
  get_linetype,
  linetype_blank,
  linetype_chord,
  linetype_lyric,
  linetype_section
} from "./line-types";
import { split_lines, to_sentence_case } from "./string-functions";

export const separate_header = (
  lines: string[]
): { header: string[]; body: string[] } => {
  // given a list of lines, finds the header and splits into header and body

  // skip blank lines
  let header_start: number;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === "---") {
      header_start = i + 1;
      break;
    }
  }
  if (header_start == null) {
    console.warn("Did not contain a header.");
    return { header: null, body: lines };
  }
  let header_end: number;
  for (let i = header_start; i < lines.length; i++) {
    if (lines[i] === "---") {
      header_end = i;
      return {
        header: lines.slice(header_start, header_end),
        body: lines.slice(header_end + 1)
      };
    }
  }
  if (header_end == null) {
    console.warn("Did not contain a header.");
    return { header: null, body: lines };
  }
};

// parsing lines
export const parse_header = (header_text: string): IHeader => {
  // todo: consider making this more smart at the cost of readability
  // if there is no header then fill in a header
  if (header_text == null || header_text === "") {
    return { title: "" };
  } else {
    header_text = header_text.replace(/(^.*?):(?=\S)/gm, "$1: "); // fix bad yaml
    let header: IHeader = { title: "" };
    header = Object.assign(header, read_toml_smart(header_text));
    return header;
  }
};

export const parse_line_chord = (line: string): string[] => {
  const line_splitted: string[] = line
    .trim()
    .slice(1)
    // .trim()
    .match(/\S+/g);
  if (line_splitted == null) {
    return [];
  } else {
    return line_splitted;
  }
};

export const parse_line_text = (line: string): string[] => {
  return line.replace(/\s+/, " ").split("^");
};

export const parse_line_section = (
  line: string
): { name: string; repeats: number } => {
  const repeat_regex = /\(?x(\d+)\)?/;
  const repeats_match = line.match(repeat_regex);
  let n_repeats: number = null;
  if (repeats_match !== null) {
    n_repeats = Number(repeats_match[1]);
    line = line.replace(repeat_regex, "");
  }
  line = line
    .trim()
    .slice(1)
    .trim();
  line = to_sentence_case(line);
  return { name: line, repeats: n_repeats };
};

export const parse_body = (body: string): ISection[] => {
  const body_parsed: ISection[] = []; // initialise output object

  // initialise a blank section
  let current_section: ISection = { name: null, repeats: null, lines: [] };
  // initialise a blank line
  let current_line: ILine = { chords: null, lyrics: null };

  // loop over each line
  for (const line of split_lines(body)) {
    switch (get_linetype(line)) {
      case linetype_blank:
        break;

      case linetype_section:
        // if the current line has content, push it
        if (!is_line_blank(current_line)) {
          current_section.lines.push(current_line);
          current_line = { chords: null, lyrics: null }; // reset the curent line
        }

        // push the current section if it's not the default undefined section
        if (!is_section_blank(current_section)) {
          body_parsed.push(current_section);
        }

        // start a new section
        current_section = { name: null, repeats: null, lines: [] };
        const parsed_section = parse_line_section(line);
        current_section.name = parsed_section.name;
        current_section.repeats = parsed_section.repeats;
        break;

      case linetype_chord:
        // if the current line has lyrics or chords, push it
        if (!is_line_blank(current_line)) {
          current_section.lines.push(current_line);
          current_line = {
            chords: null,
            lyrics: null
          };
        }
        // replace the current line's chords
        current_line.chords = parse_line_chord(line);
        break;

      case linetype_lyric:
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

        // temp check for equal number of chords in lyric line and chord line
        if (current_line.chords != null) {
          if (current_line.chords.length + 1 !== current_line.lyrics.length) {
            console.warn(
              "Different number of chords and lyrics on this line: " +
                current_line.lyrics.join("")
            );
          }
        }
        // end of temp check
        break;
    }
  }
  // push final line if it hasn't been pushed yet
  if (!is_line_blank(current_line)) {
    current_section.lines.push(current_line);
  }
  // push the final section if it is not blank
  if (!is_section_blank(current_section)) {
    body_parsed.push(current_section);
  }
  return body_parsed;
};

export const is_line_blank = (line: ILine): boolean => {
  return line.chords == null && line.lyrics == null;
};

export const is_section_blank = (section: ISection): boolean => {
  return section.lines.length === 0;
};
