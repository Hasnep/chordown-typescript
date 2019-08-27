import { IHeader, ILine, ISection } from "./chordown";
import { read_yaml_smart } from "./file-io";
import {
  get_linetype,
  linetype_blank,
  linetype_chord,
  linetype_lyric,
  linetype_section,
} from "./line-types";
import { split_lines, to_sentence_case } from "./string-functions";

export function separate_header(lines: string[]): { header: string[]; body: string[] } {
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
        body: lines.slice(header_end + 1),
      };
    }
  }
  if (header_end == null) {
    console.warn("Did not contain a header.");
    return { header: null, body: lines };
  }
}

// parsing lines
export function parse_header(header_text: string): IHeader {
  // todo: consider making this more smart at the cost of readability
  // if there is no header then fill in a header
  if (header_text == null || header_text === "") {
    return { title: "" };
  } else {
    header_text = header_text.replace(/(^.*?):(?=\S)/gm, "$1: "); // fix bad yaml
    let header: IHeader = { title: "" };
    header = Object.assign(header, read_yaml_smart(header_text));
    return header;
  }
}

export function parse_line_chord(line: string): string[] {
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
}

export function parse_line_lyrics(line: string): string[] {
  return line.replace(/\s+/, " ").split("^");
}

export function parse_line_section(line: string): string {
  line = line
    .trim()
    .slice(1)
    .trim();
  if (line.slice(-1) === ":") {
    line = line.slice(0, -1).trim();
  }
  line = to_sentence_case(line);
  return line;
}

export function parse_body(body: string): ISection[] {
  // initialise output object
  const body_parsed: ISection[] = [];
  // initialise a blank section
  let current_section: ISection = { name: null, repeats: null, lines: [] };
  // initialise a blank line
  let current_line: ILine = { chords: null, lyrics: null };
  // initialise a sequence of chords to remember
  let remembered_chords: string[] = [];

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
        current_section.name = parse_line_section(line);

        // check if there is a section to remember
        for (let remembered_section of body_parsed) {
          if (remembered_section.name === current_section.name) {
            for (let remembered_line of remembered_section.lines) {
              for (let remembered_chord of remembered_line.chords) {
                remembered_chords.push(remembered_chord);
              }
            }
            break;
          }
        }
        break;
      case linetype_chord:
        // if the current line has lyrics or chords, push it
        if (!is_line_blank(current_line)) {
          current_section.lines.push(current_line);
          current_line = {
            chords: null,
            lyrics: null,
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
            lyrics: null,
          };
        }
        // replace the current line's lyrics
        current_line.lyrics = parse_line_lyrics(line);

        // temp check for equal number of chords in lyric line and chord line
        if (current_line.chords != null) {
          if (current_line.chords.length + 1 !== current_line.lyrics.length) {
            console.warn("Different number of chords and lyrics on this line: " + current_line.lyrics.join(""));
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
}

export function is_line_blank(line: ILine): boolean {
  return line.chords == null && line.lyrics == null;
}

export function is_section_blank(section: ISection): boolean {
  return section.lines.length === 0;
}
