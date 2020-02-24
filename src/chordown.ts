import { IChordown } from "./interfaces";

import { parse_body, parse_header, separate_header } from "./parser";
import { split_lines } from "./string-functions";

export function chordown(inupt_text: string): IChordown {
  let { header, body } = separate_header(split_lines(inupt_text));
  if (header == null) {
    header = [""];
  }
  return {
    header: parse_header(header.join("\n")),
    body: parse_body(body.join("\n"))
  };
}
