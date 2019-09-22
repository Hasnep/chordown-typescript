export interface IChordown {
  header: IHeader;
  body: ISection[];
}

export interface IHeader {
  title: string;
  subtitle?: string;
  key?: string;
  artist?: string;
  tempo?: number;
  time?: string;
  transpose?: number | string;
  capo?: number;
  columns?: number;
}

export interface ISection {
  name: string;
  repeats: number;
  lines: ILine[];
}

export interface ILine {
  chords: string[];
  lyrics: string[];
}
