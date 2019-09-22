import { assert } from "chai";
import "mocha";
import { separate_chord, transpose_chord } from "../src/transpose";

describe("separate_chord", function() {
  it("separates a simple chord", function() {
    assert.deepEqual(separate_chord("C"), { root: "C", type: "", bass: undefined });
  });

  it("separates a simple chord", function() {
    assert.deepEqual(separate_chord("Bbmaj7/9"), { root: "Bb", type: "maj7/9", bass: undefined });
  });
});

describe("transpose_chord", function() {
  it("transposes a simple chord", function() {
    assert.deepEqual(transpose_chord(separate_chord("C"), 1), { root: "C#", type: "", bass: undefined });
  });

  it("transposes a complex chord", function() {
    assert.deepEqual(transpose_chord(separate_chord("Bbmaj7/9"), -2), { root: "G#", type: "maj7/9", bass: undefined });
  });
});
