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