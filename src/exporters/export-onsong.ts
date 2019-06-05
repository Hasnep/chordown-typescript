import { Chordown } from "../chordown";

export function export_onsong(chordown: Chordown): string {
  let out: string = "";

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
