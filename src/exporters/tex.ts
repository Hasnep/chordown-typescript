import { IChordown, ILine } from "../interfaces";
import { IConfig } from "../config";

const preamble = `
\\documentclass[12pt]{article}
\\usepackage[chorded, noshading]{songs}

%% change font
\\usepackage{ifxetex}
\\ifxetex{}
\\usepackage[no-math]{fontspec}
\\defaultfontfeatures{Ligatures=TeX}
\\setmainfont{Roboto}
\\setsansfont{Oswald}
\\else
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\fi

%% non-songs package settings
\\usepackage[paperheight=540pt, paperwidth=960pt, margin=10pt]{geometry} % 16:9 landscape page size
% \\usepackage[paperheight=216mm, paperwidth=384mm, margin=10mm]{geometry} % 16:9 landscape page size

\\pagenumbering{gobble} % remove page numbers

%% songs package
\\setlength{\\sbarheight}{0pt} % set horizontal line thickness to 0 to remove the lines
\\songcolumns{2} % set the number of columns to 0 to return to default page layout
\\setlength{\\cbarwidth}{1.5cm} % remove the vertical bar next to choruses
\\renewcommand{\\flatsymbol}{\\ensuremath{\\flat}} % redefine the flat symbol to not be superscript
\\renewcommand{\\sharpsymbol}{\\ensuremath{\\sharp}} % redefine the sharp symbol to be a sharp instead of a hash and also not be superscript
\\newcommand{\\keysignature}{} % make a new command to print the key
\\newsongkey{key}{\\def\\keysignature{}}{\\def\\keysignature{(#1)}} % key signature
\\renewcommand\\showauthors{\\songauthors} % redo the showauthors command to just display the artist in normal text
\\renewcommand\\makeprelude{\\resettitles\\Large\\sffamily\\songtitle\\nexttitle\\foreachtitle{~(\\songtitle)}~---~\\extendprelude} % format the title, subtitle and artist
\\renewcommand{\\extendprelude}{\\showauthors~\\keysignature} % make sure only the artist is shown in the prelude, stuff like the copyright holder, references and arranger are never shown
\\renewcommand\\makepostlude{} % make sure there is nothing after the song
\\renewcommand{\\printchord}[1]{\\rmfamily#1} % set chords to print the same as lyrics
\\setlength{\\versenumwidth}{2.5cm} % set the space to the left of the lyrics reserved for the verse name
\\newcommand{\\mysectionstyle}{\\sffamily\\large} % set the style for section names
\\newcommand{\\myverse}[1]{\\renewcommand{\\printversenum}[1]{\\mysectionstyle #1:}} % custom command to automatically reset verse names and number
% \\newcommand{\\mychorus}{\\renewcommand{\\printversenum}[1]{\\mysectionstyle Chorus:}} % custom command to automatically reset chorus name
\\baselineadj=5pt plus 1pt minus 0pt % increase the distance between lines
\\renewcommand{\\clineparams}{\\baselineskip=12pt\\lineskiplimit=0pt\\lineskip=0pt} % set the gap between chords and lyrics
\\renewcommand{\\notefont}{\\textrm} % set the font style for the capo
\\renewcommand\\capo[1]{\\iftranscapos\\transpose{#1}\\else\\musicnote{Capo: #1}\\fi} % change capo macro to title case

% \\flushbottom
% \\renewcommand\\lyricfont{\\normalfont\\normalsize}
% \\renewcommand\\versefont{}
% \\renewcommand\\chorusfont{}
% \\renewcommand\\theversenum{\\versenumstyle{versenum}}
% \\renewcommand\\versejustify{\\justifyright}
`;

export const escape_tex = (s: string): string => {
  if (s != null) {
    return s.toString().replace("&", "\\&");
  } else {
    return null;
  }
};

const export_tex_line = (line: ILine): string => {
  let { chords, lyrics } = line;

  // escape special TeX characters
  if (lyrics != null) {
    lyrics = lyrics.map(escape_tex);
  }

  // replace flats with ampersands for the songs package
  if (chords != null) {
    chords = chords.map((c) => {
      return c.replace("b", "&");
    });
  }

  let out = "";
  if (chords == null) {
    out += lyrics.join("");
  } else {
    chords = chords.map((chord) => "\\[" + chord + "]");
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
};

export const export_tex = (chordown: IChordown, config: IConfig): string => {
  let out: string = preamble;

  for (const [key, value] of Object.entries(chordown.header)) {
    if (value != null) {
      chordown.header[key] = escape_tex(value);
    }
  }

  // if (Object.keys(config.output.tex).includes("columns")) {
  //   out +=
  //     "\\songcolumns{" +
  //     config.output["tex"]["columns"] +
  //     "} % set the number of columns\n";
  // } else {
  //   out +=
  //     "\\songcolumns{0} % set the number of columns to 0 to return to default page layout\n";
  // }
  out += "\\begin{document}\n\\begin{songs}{}\n";
  const title: string = chordown.header.title;
  let subtitle = "";
  if (Object.prototype.hasOwnProperty.call(chordown.header, "subtitle")) {
    subtitle = "\\\\" + chordown.header.subtitle;
  }
  let artist = "";
  if (Object.prototype.hasOwnProperty.call(chordown.header, "artist")) {
    artist = "by={" + chordown.header.artist + "}";
  }
  let artist_and_key = "";
  if (
    Object.prototype.hasOwnProperty.call(chordown.header, "artist") &&
    Object.prototype.hasOwnProperty.call(chordown.header, "key")
  ) {
    artist_and_key = ", ";
  }
  let key = "";
  if (Object.prototype.hasOwnProperty.call(chordown.header, "key")) {
    key = "key={" + chordown.header.key + "}";
  }
  out += `\\beginsong{${title}${subtitle}}[${artist}${artist_and_key}${key}]\n`;

  for (const section of chordown.body) {
    out += "\\myverse{" + section.name + "}\n\\beginverse\n";
    for (const line of section.lines) {
      out += export_tex_line(line) + "\n";
    }
    out += "\\endverse\n";
  }
  return out + "\\endsong\n\\end{songs}\n\\end{document}\n";
};
