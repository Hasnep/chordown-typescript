import { first_character } from "../src/string-functions";

// line types
export const line_blank: number = 0;
export const line_text: number = 1;
export const line_chord: number = 2;
export const line_section: number = 3;

// checking line types
export function is_line_blank(line: string): boolean {
  return first_character(line.trim()) == "";
}

export function is_line_chord(line: string): boolean {
  return first_character(line.trim()) == ":";
}

export function is_line_section(line: string): boolean {
  return first_character(line.trim()) == "#";
}

export function get_linetype(line: string): number {
  if (is_line_blank(line)) {
    return line_blank;
  } else if (is_line_chord(line)) {
    return line_chord;
  } else if (is_line_section(line)) {
    return line_section;
  } else {
    return line_text;
  }
}
