// string manipulation
export const to_sentence_case = (s: string): string => {
  // converts the input string to sentence case
  // i.e. capitalises the first character and makes all other characters lowercase
  if (s.length > 0) {
    if (s.slice(0, 1).match(/[a-z]/i)) {
      return s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase();
    } else {
      return s.slice(0, 1) + to_sentence_case(s.slice(1));
    }
  } else {
    return "";
  }
};

export const first_character = (line: string): string => {
  // returns the first non-whitespace character in a line
  return line.trim().charAt(0);
};

export const split_lines = (str: string): string[] => {
  // splits a string based on linebreaks
  if (str === undefined) {
    return null;
  }
  return str.split(/\r\n|\r|\n/).map((line) => line.trim());
};

export const get_file_name = (file_path: string): string => {
  // returns the name of the file without the path or extension
  return file_path.match(/.*\/(.*)\..*/)[1];
};

export const get_file_extenstion = (file_path: string): string => {
  // returns the extension of the file without the path, name or a dot (.)
  return file_path.match(/.*\.(.*)/)[1];
};

export const get_file_path = (file_path: string): string => {
  // returns the path of the file without the file name or extension
  return file_path.match(/(.*\/)(?:.*\..*)?/)[1];
};
