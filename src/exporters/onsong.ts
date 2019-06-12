import { Chordown, Line } from "../chordown";

function export_onsong_line(line: Line): string {
  let { chords, lyrics } = line;
  let out: string = "";
  if (chords == null) {
    out += lyrics.join("");
  } else {
    chords = chords.map((chord) => "[" + chord + "]");
    if (lyrics == null) {
      out += chords.join(" ");
    } else {
      out += lyrics[0];
      for (let i = 1; i < lyrics.length; i++) {
        out += chords[i - 1] + lyrics[i];
      }
    }
  }
  return out;
}

export function export_onsong(chordown: Chordown): string {
  let out: string = "";

  out += chordown.header.title;
  if (chordown.header.hasOwnProperty("subtitle")) {
    out += " (" + chordown.header.subtitle + ")";
  }
  out += "\n";
  if (chordown.header.hasOwnProperty("artist")) {
    out += chordown.header.artist;
  }
  out += "\n";
  out += "Key:";
  if (chordown.header.hasOwnProperty("key")) {
    out += " [" + chordown.header.key + "]";
  }
  out += "\n";
  if (chordown.header.hasOwnProperty("capo")) {
    out += "Capo: " + chordown.header.key + "\n";
  }
  out += "\n";

  for (const section of chordown.body) {
    if (section.name != null) {
      out += section.name + ":" + "\n";
    }
    for (const line of section.lines) {
      out += export_onsong_line(line);
    }
    out += "\n";
  }
  return out;
}
