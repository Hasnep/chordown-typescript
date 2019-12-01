import { assert } from "chai";
import "mocha";
import {
  IChord,
  separate_chord,
  transpose_chord,
  count_accidentals,
} from "../src/transpose";

describe("separate_chord", function() {
  it("separates a simple chord", function() {
    const expected_output: IChord = {
      root: "C",
      type: "",
      bass: undefined,
    };
    assert.deepEqual(separate_chord("C"), expected_output);
  });

  it("separates a complex chord", function() {
    const expected_output: IChord = {
      root: "Bb",
      type: "maj7/9",
      bass: undefined,
    };
    assert.deepEqual(separate_chord("Bbmaj7/9"), expected_output);
  });

  it("separates a complex chord with a bass note", function() {
    const expected_output: IChord = {
      root: "Bb",
      type: "maj7/9",
      bass: "Gb",
    };
    assert.deepEqual(separate_chord("Bbmaj7/9/Gb"), expected_output);
  });
});

describe("transpose_chord", function() {
  it("transposes a simple chord", function() {
    const chord_input: IChord = {
      root: "C",
      type: "",
      bass: undefined,
    };
    const expected_output: IChord = {
      root: "C#",
      type: "",
      bass: undefined,
    };
    assert.deepEqual(transpose_chord(chord_input, 1), expected_output);
  });

  it("transposes a complex chord", function() {
    const chord_input: IChord = {
      root: "Bb",
      type: "maj7/9",
      bass: undefined,
    };
    const expected_output: IChord = {
      root: "G#",
      type: "maj7/9",
      bass: undefined,
    };
    assert.deepEqual(transpose_chord(chord_input, -2), expected_output);
  });

  it("transposes a complex chord with a bass note", function() {
    const chord_input: IChord = {
      root: "Bb",
      type: "maj7/9",
      bass: "Gb",
    };
    const expected_output: IChord = {
      root: "G#",
      type: "maj7/9",
      bass: "E",
    };
    assert.deepEqual(transpose_chord(chord_input, -2), expected_output);
  });
});

describe("count_accidentals", function() {
  it("counts the number of sharps in major keys", function() {
    const test_input: string[] = [
      "Gb",
      "Db",
      "Ab",
      "Eb",
      "Bb",
      "F",
      "C",
      "G",
      "D",
      "A",
      "E",
      "B",
      "F#",
    ];
    const expected_output: number[] = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6];
    const test_output: number[] = test_input.map((x) =>
      count_accidentals({ root: x, type: "" }, "#"),
    );
    assert.deepEqual(test_output, expected_output);
  });

  it("counts the number of sharps in minor keys", function() {
    const test_input: string[] = [
      "Eb",
      "Bb",
      "F",
      "C",
      "G",
      "D",
      "A",
      "E",
      "B",
      "F#",
      "C#",
      "G#",
      "D#",
    ];
    const expected_output: number[] = [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6];
    const test_output: number[] = test_input.map((x) =>
      count_accidentals({ root: x, type: "minor" }, "#"),
    );
    assert.deepEqual(test_output, expected_output);
  });

  it("counts the number of flats in major keys", function() {
    const test_input: string[] = [
      "Gb",
      "Db",
      "Ab",
      "Eb",
      "Bb",
      "F",
      "C",
      "G",
      "D",
      "A",
      "E",
      "B",
      "F#",
    ];
    const expected_output: number[] = [6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6];
    const test_output: number[] = test_input.map((x) =>
      count_accidentals({ root: x, type: "" }, "b"),
    );
    assert.deepEqual(test_output, expected_output);
  });

  it("counts the number of flats in minor keys", function() {
    const test_input: string[] = [
      "Eb",
      "Bb",
      "F",
      "C",
      "G",
      "D",
      "A",
      "E",
      "B",
      "F#",
      "C#",
      "G#",
      "D#",
    ];
    const expected_output: number[] = [6, 5, 4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6];
    const test_output: number[] = test_input.map((x) =>
      count_accidentals({ root: x, type: "minor" }, "b"),
    );
    assert.deepEqual(test_output, expected_output);
  });
});
