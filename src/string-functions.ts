// string manipulation
export function to_sentence_case(s: string) {
  // converts the input string to sentence case
  // i.e. capitalises the first character and makes all other characters lowercase
  return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
}

export function first_character(line: string): string {
  // returns the first non-whitespace character in a line
  return line.trim().charAt(0);
}

export function split_lines(str: string): string[] {
  // splits a string based on linebreaks
  if (str === undefined) {
    return null;
  }
  return str.split(/\r\n|\r|\n/).map((line) => line.trim());
}

export function get_file_name(file_path: string): string {
  // returns the name of the file without the path or extension
  return file_path.match(/.*\/(.*)\..*/)[1];
}

export function get_file_extenstion(file_path: string): string {
  // returns the extension of the file without the path, name or a dot (.)
  return file_path.match(/.*\.(.*)/)[1];
}

export function get_file_path(file_path: string): string {
  // returns the path of the file without the file name or extension
  return file_path.match(/(.*\/)(?:.*\..*)?/)[1];
}
