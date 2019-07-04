import { first_character } from "./string-functions";

// line types
export const linetype_blank: number = 0;
export const linetype_lyric: number = 1;
export const linetype_chord: number = 2;
export const linetype_section: number = 3;

// checking line types
export function is_linetype_blank(line: string): boolean {
  return first_character(line.trim()) === "";
}

export function is_linetype_chord(line: string): boolean {
  return first_character(line.trim()) === ":";
}

export function is_linetype_section(line: string): boolean {
  return first_character(line.trim()) === "#";
}

export function get_linetype(line: string): number {
  if (is_linetype_blank(line)) {
    return linetype_blank;
  } else if (is_linetype_chord(line)) {
    return linetype_chord;
  } else if (is_linetype_section(line)) {
    return linetype_section;
  } else {
    return linetype_lyric;
  }
}
