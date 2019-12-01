import { IChordown } from "./chordown";

export interface IChord {
  root: string;
  type: string;
  bass?: string;
}

export function transpose(chordown_object: IChordown) {
  let transpose_by: number = 0;
  if ("transpose" in chordown_object.header) {
    if (typeof chordown_object.header.transpose === "string") {
      const key_id_new: number = note_to_id(chordown_object.header.transpose);
      const key_id_old: number = note_to_id(chordown_object.header.key);
      transpose_by = key_id_new - key_id_old;
    } else if (typeof chordown_object.header.transpose === "number") {
      transpose_by = chordown_object.header.transpose;
    }
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
          return chord_to_string(
            transpose_chord(separate_chord(chord), transpose_by),
          );
        });
      }
    }
  }

  return chordown_object;
}

export function transpose_chord(
  chord: IChord,
  transpose_by: number,
  key: IChord = null,
): IChord {
  const chord_root_id_old: number = note_to_id(chord.root);
  const chord_root_id_new: number = (chord_root_id_old + transpose_by) % 12;
  chord.root = id_to_note(chord_root_id_new, key);

  if (chord.bass !== undefined) {
    const chord_bass_id_old: number = note_to_id(chord.bass);
    const chord_bass_id_new: number = (chord_bass_id_old + transpose_by) % 12;
    chord.bass = id_to_note(chord_bass_id_new, key);
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
    return {
      root: matches.groups.root,
      type: matches.groups.type,
      bass: matches.groups.bass,
    };
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

const note_to_id_mapping = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  "E#": 5,
  Fb: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
  "B#": 12,
  Cb: 11,
};

const id_to_note_mapping: {
  sharps: object;
  flats: object;
} = {
  sharps: {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B",
  },
  flats: {
    0: "C",
    1: "Db",
    2: "D",
    3: "Eb",
    4: "E",
    5: "F",
    6: "Gb",
    7: "G",
    8: "Ab",
    9: "A",
    10: "Bb",
    11: "B",
  },
};

export function count_accidentals(
  key: IChord,
  accidental_type: string,
): number {
  const key_id: number = note_to_id(key.root);

  let n_accidentals: number;
  if (key.type === "m" || key.type === "minor") {
    n_accidentals = -3;
  } else {
    n_accidentals = 0;
  }

  let step_by: number;
  if (accidental_type === "#") {
    step_by = 7;
  } else if (accidental_type === "b") {
    step_by = 5;
  } else {
    console.error("wrong arg");
  }

  let check_id: number = 0;
  while (check_id !== key_id) {
    check_id = (check_id + step_by) % 12;
    n_accidentals += 1;
  }

  if (n_accidentals < 0) {
    return n_accidentals + 12;
  } else {
    return n_accidentals;
  }
}

function key_to_sharps_or_flats(key: IChord): string {
  const n_sharps = count_accidentals(key, "#");
  const n_flats = count_accidentals(key, "b");

  if (n_sharps <= n_flats) {
    return "#";
  } else {
    return "b";
  }
}
