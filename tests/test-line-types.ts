import {
  get_linetype,
  line_text,
  line_section,
  line_chord,
  line_blank,
  is_line_section,
  is_line_blank,
  is_line_chord
} from "../src/line-types";
import "mocha";
import { assert } from "chai";


describe("is_line_blank", function() {
  it("returns true for empty lines", function() {
    assert.equal(is_line_blank(""), true);
  });

  it("returns true for whitespace lines", function() {
    assert.equal(is_line_blank("        "), true);
  });

  it("returns false for anything else", function() {
    assert.equal(is_line_blank("   a     "), false);
  });
});

describe("is_line_chord", function() {
  it("returns true for chord lines", function() {
    assert.equal(is_line_chord(": C G Am F"), true);
  });

  it("returns true for lines starting with whitespace", function() {
    assert.equal(is_line_chord("   : C G     "), true);
  });

  it("returns false for anything else", function() {
    assert.equal(is_line_chord(" a  : Hasd   "), false);
  });
});

describe("is_line_section", function() {
  it("returns true for section lines", function() {
    assert.equal(is_line_section("#verse"), true);
  });

  it("returns true for lines starting with whitespace", function() {
    assert.equal(is_line_section("   # C G     "), true);
  });

  it("returns false for anything else", function() {
    assert.equal(is_line_section(" asdasd # das "), false);
  });
});

describe("get_linetype", function() {
  it("returns line_blank for empty lines", function() {
    assert.equal(get_linetype(""), line_blank);
  });

  it("returns line_blank for whitespace lines", function() {
    assert.equal(get_linetype("    "), line_blank);
  });

  it("returns line_chord for chord lines", function() {
    assert.equal(get_linetype(":adsjk    "), line_chord);
  });

  it("returns line_section for section lines", function() {
    assert.equal(get_linetype("#adsjk    "), line_section);
  });

  it("returns line_text for any other lines", function() {
    assert.equal(get_linetype("    ad  sjk    "), line_text);
  });
});
