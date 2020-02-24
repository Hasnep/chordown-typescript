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

describe("is_line_blank", function() {
  it("returns true for empty lines", function() {
    assert.equal(is_linetype_blank(""), true);
  });

  it("returns true for whitespace lines", function() {
    assert.equal(is_linetype_blank("        "), true);
  });

  it("returns false for anything else", function() {
    assert.equal(is_linetype_blank("   a     "), false);
  });
});

describe("is_line_chord", function() {
  it("returns true for chord lines", function() {
    assert.equal(is_linetype_chord(": C G Am F"), true);
  });

  it("returns true for lines starting with whitespace", function() {
    assert.equal(is_linetype_chord("   : C G     "), true);
  });

  it("returns false for anything else", function() {
    assert.equal(is_linetype_chord(" a  : Hasd   "), false);
  });
});

describe("is_line_section", function() {
  it("returns true for section lines", function() {
    assert.equal(is_linetype_section("#verse"), true);
  });

  it("returns true for lines starting with whitespace", function() {
    assert.equal(is_linetype_section("   # C G     "), true);
  });

  it("returns false for anything else", function() {
    assert.equal(is_linetype_section(" asdasd # das "), false);
  });
});

describe("get_linetype", function() {
  it("returns line_blank for empty lines", function() {
    assert.equal(get_linetype(""), linetype_blank);
  });

  it("returns line_blank for whitespace lines", function() {
    assert.equal(get_linetype("    "), linetype_blank);
  });

  it("returns line_chord for chord lines", function() {
    assert.equal(get_linetype(":adsjk    "), linetype_chord);
  });

  it("returns line_section for section lines", function() {
    assert.equal(get_linetype("#adsjk    "), linetype_section);
  });

  it("returns line_text for any other lines", function() {
    assert.equal(get_linetype("    ad  sjk    "), linetype_lyric);
  });
});
