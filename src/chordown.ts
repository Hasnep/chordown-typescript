import { IChordown } from "./interfaces";

import { parse_body, parse_header, separate_header } from "./parser";
import { split_lines } from "./string-functions";

export const chordown = (inupt_text: string): IChordown => {
  const { header, body } = separate_header(split_lines(inupt_text));
  return {
    header: parse_header(header == null ? "" : header.join("\n")),
    body: parse_body(body.join("\n"))
  };
};
