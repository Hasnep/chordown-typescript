import { to_sentence_case } from "../string-functions";
import { Chordown, Line } from "../chordown";

// chordown as plaintext
function export_plaintext_line(line: Line): string {
  let { chords, lyrics } = line;
  let out: string = "";
  if (chords == null) {
    out += lyrics.join("") + "\n";
  } else if (lyrics == null) {
    out += chords.join(" ") + "\n";
  } else {
    let lyrics_out: string = lyrics[0];
    let chords_out: string = " ".repeat(lyrics[0].length);
    for (let i = 1; i < lyrics.length; i++) {
      let n_spaces: number = Math.max(
        lyrics[i].length,
        chords[i - 1].length + 1
      );
      lyrics_out = lyrics_out + lyrics[i].padEnd(n_spaces);
      chords_out = chords_out + chords[i - 1].padEnd(n_spaces);
    }
    out += chords_out + "\n" + lyrics_out + "\n";
  }
  return out;
}

export function export_plaintext(chordown: Chordown): string {
  let out: string = "";
  if (
    !(
      Object.keys(chordown.header).length <= 1 &&
      Object.keys(chordown.header)[0] == ""
    )
  ) {
    for (let header_key of Object.keys(chordown.header)) {
      out +=
        to_sentence_case(header_key) +
        ": " +
        chordown.header[header_key] +
        "\n";
    }
  }

  for (let section of chordown.body) {
    if (section.name != null) {
      out += section.name + ":" + "\n";
    }

    for (let line of section.lines) {
      out += export_plaintext_line(line);
    }
    out += "\n";
  }
  return out;
}
