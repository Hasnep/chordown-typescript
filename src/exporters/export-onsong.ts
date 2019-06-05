import { Chordown } from "../chordown";

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

  //   for (let header_key of Object.keys(chordown.header)) {
  //     out += `${to_sentence_case(header_key)}: ${
  //       chordown.header[header_key]
  //     }\n`;
  //   }
  //   // out = out + "\n";
  

  // for (let section of chordown.body) {
  //   if (section.name != null) {
  //     out += section.name + ":" + "\n";
  //   }

  //   for (let line of section.lines) {
  //     out = out + export_onsong_line(line);
  //   }
  //   out += "\n";
  // }
  return out;
}
