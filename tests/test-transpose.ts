import { assert } from "chai";
import "mocha";
import { IChord, separate_chord, transpose_chord } from "../src/transpose";

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
