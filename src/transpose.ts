import { IChordown } from "./chordown";

export interface IChord {
  root: string;
  type: string;
  bass: string;
}

export function transpose(chordown_object: IChordown) {
  let transpose_by: number;
  if (!("transpose" in chordown_object.header)) {
    transpose_by = 0;
  } else if (typeof chordown_object.header.transpose === "string") {
    const key_id_new: number = note_to_id(chordown_object.header.transpose);
    const key_id_old: number = note_to_id(chordown_object.header.key);
    transpose_by = key_id_new - key_id_old;
  } else {
    transpose_by = chordown_object.header.transpose;
  }

  chordown_object.header.key = chord_to_string(
    transpose_chord(
      { root: chordown_object.header.key, type: "", bass: undefined },
      transpose_by,
    ),
  );

  for (const section of chordown_object.body) {
    for (const line of section.lines) {
      if (line.chords != null) {
        line.chords = line.chords.map(function(chord: string): string {
          return chord_to_string(transpose_chord(separate_chord(chord), transpose_by));
        });
      }
    }
  }

  return chordown_object;
}

export function transpose_chord(chord: IChord, transpose_by: number): IChord {
  const chord_root_id_old: number = note_to_id(chord.root);
  const chord_root_id_new: number = (chord_root_id_old + transpose_by) % 12;
  chord.root = id_to_note(chord_root_id_new);

  if (chord.bass !== undefined) {
    const chord_bass_id_old: number = note_to_id(chord.bass);
    const chord_bass_id_new: number = (chord_bass_id_old + transpose_by) % 12;
    chord.bass = id_to_note(chord_bass_id_new);
  }
  return chord;
}

export function separate_chord(chord: string): IChord {
  const chord_pattern = /^(?<root>[A-G][#b]?)(?<type>.*?)(?:\/(?<bass>[A-G][#b]?))?$/;
  const matches = chord_pattern.exec(chord);
  if (matches == null) {
    console.warn(`Unable to parse chord '${chord}'`);
    return { root: "", type: chord, bass: null };
  } else {
    return { root: matches.groups.root, type: matches.groups.type, bass: matches.groups.bass };
  }
}

export function note_to_id(note: string): number {
  if (note in note_to_id_mapping) {
    return note_to_id_mapping[note];
  } else {
    return null;
  }
}

export function id_to_note(id: number): string {
  return id_to_note_mapping.naturals[id];
}

function chord_to_string(chord: IChord): string {
  let chord_string = chord.root + chord.type;
  if (chord.bass !== undefined) {
    chord_string += "/" + chord.bass;
  }
  return chord_string;
}

const major_scale_ids: number[] = [0, 2, 4, 5, 7, 9, 11];

const order_of_sharps: string[] = ["F", "C", "G", "D", "A", "E", "B"];

function key_to_sharps(note: string): string[] {
  return order_of_sharps.slice(0);
}

const key_to_n_sharps = {
  "C": 0,
  "G": 1,
  "D": 2,
  "A": 3,
  "E": 4,
  "B": 5,
  "F#": 6,
  "C#": 7,
};

const key_to_n_flats = { C: 0, F: 1, Bb: 2, Eb: 3, Ab: 4, Db: 5, Gb: 6, Cb: 7 };

const note_to_id_mapping = {
  "C": 0,
  "C#": 1,
  "Db": 1,
  "D": 2,
  "D#": 3,
  "Eb": 3,
  "E": 4,
  "E#": 5,
  "Fb": 4,
  "F": 5,
  "F#": 6,
  "Gb": 6,
  "G": 7,
  "G#": 8,
  "Ab": 8,
  "A": 9,
  "A#": 10,
  "Bb": 10,
  "B": 11,
  "B#": 12,
  "Cb": 11,
};

const id_to_note_mapping: { naturals: object; sharps: object; flats: object } = {
  naturals: { 0: "C", 1: "C#", 2: "D", 3: "Eb", 4: "E", 5: "F", 6: "F#", 7: "G", 8: "G#", 9: "A", 10: "Bb", 11: "B" },
  sharps: { 0: "C", 1: "C#", 2: "D", 3: "D#", 4: "E", 5: "F", 6: "F#", 7: "G", 8: "G#", 9: "A", 10: "A#", 11: "B" },
  flats: { 0: "C", 1: "C#", 2: "D", 3: "Eb", 4: "E", 5: "F", 6: "F#", 7: "G", 8: "G#", 9: "A", 10: "Bb", 11: "B" },
};
