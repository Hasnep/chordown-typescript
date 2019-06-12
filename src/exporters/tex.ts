import { Chordown, Line } from "../chordown";
import { read_file_smart } from "../file-io";
import { Config } from "../config";

const preamble: string = read_file_smart("templates/preamble.txt");

function export_tex_line(line: Line): string {
  let { chords, lyrics } = line;

  let out: string = "";
  if (chords == null) {
    out += lyrics.join("");
  } else {
    chords = chords.map(chord => "\\[" + chord + "]");
    if (lyrics == null) {
      out += "{\\nolyrics " + chords.join(" ") + "}";
    } else {
      out += lyrics[0];
      for (let i = 1; i < lyrics.length; i++) {
        out += chords[i - 1] + lyrics[i];
      }
    }
  }
  return out;
}

export function export_tex(chordown: Chordown, config: Config): string {
  let out: string = preamble;
  // if (Object.keys(config.output.tex).includes("columns")) {
  //   out +=
  //     "\\songcolumns{" +
  //     config.output["tex"]["columns"] +
  //     "} % set the number of columns\n";
  // } else {
  //   out +=
  //     "\\songcolumns{0} % set the number of columns to 0 to return to default page layout\n";
  // }
  out += "\\begin{document}\n";
  let title: string = chordown.header.title;
  let subtitle: string = "";
  if (chordown.header.hasOwnProperty("subtitle")) {
    subtitle = "\\\\" + chordown.header.subtitle;
  }
  let artist: string = "";
  if (chordown.header.hasOwnProperty("artist")) {
    artist = "by={" + chordown.header.artist + "}";
  }
  let artist_and_key: string = "";
  if (
    chordown.header.hasOwnProperty("artist") &&
    chordown.header.hasOwnProperty("key")
  ) {
    artist_and_key = ", ";
  }
  let key: string = "";
  if (chordown.header.hasOwnProperty("key")) {
    key = "key={" + chordown.header.key + "}";
  }
  out +=
    "\\beginsong{" +
    title +
    subtitle +
    "}[" +
    artist +
    artist_and_key +
    key +
    "]\n";

  for (let section of chordown.body) {
    out += "\\myverse{" + section.name + "}\n\\beginverse\n";
    for (let line of section.lines) {
      out += export_tex_line(line) + "\n";
    }
    out += "\\endverse\n";
  }
  return out + "\\endsong\n\\end{document}\n";
}
