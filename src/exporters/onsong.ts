import { IChordown, ILine } from "../interfaces";

export const export_onsong_line = (line: ILine): string => {
  let chords = line[0];
  const lyrics = line[1];
  let out = "";
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
};

export const export_onsong = (chordown: IChordown): string => {
  let out = "";

  out += chordown.header.title;

  if (Object.prototype.hasOwnProperty.call(chordown.header, "subtitle")) {
    out += " (" + chordown.header.subtitle + ")";
  }
  out += "\n";
  if (Object.prototype.hasOwnProperty.call(chordown.header, "artist")) {
    out += chordown.header.artist;
  }
  out += "\n";
  out += "Key:";
  if (Object.prototype.hasOwnProperty.call(chordown.header, "key")) {
    out += " [" + chordown.header.key + "]";
  }
  out += "\n";
  if (Object.prototype.hasOwnProperty.call(chordown.header, "capo")) {
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
};
