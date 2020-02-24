import { assert } from "chai";
import "mocha";
import {
  get_linetype,
  is_linetype_blank,
  is_linetype_chord,
  is_linetype_section,
  linetype_blank,
  linetype_chord,
  linetype_section,
  linetype_lyric
} from "../src/line-types";

describe("is_line_blank", () => {
  it("returns true for empty lines", () => {
    assert.equal(is_linetype_blank(""), true);
  });

  it("returns true for whitespace lines", () => {
    assert.equal(is_linetype_blank("        "), true);
  });

  it("returns false for anything else", () => {
    assert.equal(is_linetype_blank("   a     "), false);
  });
});

describe("is_line_chord", () => {
  it("returns true for chord lines", () => {
    assert.equal(is_linetype_chord(": C G Am F"), true);
  });

  it("returns true for lines starting with whitespace", () => {
    assert.equal(is_linetype_chord("   : C G     "), true);
  });

  it("returns false for anything else", () => {
    assert.equal(is_linetype_chord(" a  : Hasd   "), false);
  });
});

describe("is_line_section", () => {
  it("returns true for section lines", () => {
    assert.equal(is_linetype_section("#verse"), true);
  });

  it("returns true for lines starting with whitespace", () => {
    assert.equal(is_linetype_section("   # C G     "), true);
  });

  it("returns false for anything else", () => {
    assert.equal(is_linetype_section(" asdasd # das "), false);
  });
});

describe("get_linetype", () => {
  it("returns line_blank for empty lines", () => {
    assert.equal(get_linetype(""), linetype_blank);
  });

  it("returns line_blank for whitespace lines", () => {
    assert.equal(get_linetype("    "), linetype_blank);
  });

  it("returns line_chord for chord lines", () => {
    assert.equal(get_linetype(":adsjk    "), linetype_chord);
  });

  it("returns line_section for section lines", () => {
    assert.equal(get_linetype("#adsjk    "), linetype_section);
  });

  it("returns line_text for any other lines", () => {
    assert.equal(get_linetype("    ad  sjk    "), linetype_lyric);
  });
});
