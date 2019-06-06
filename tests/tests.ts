import {
  parse_line_chord,
  parse_body,
  separate_header
} from "../src/chordown-parse";
import { to_sentence_case, first_character } from "../src/string-functions";
import { read_config_file } from "../src/chordown-config";
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
import { fix_path } from "../src/file-io";
import "mocha";
import { assert } from "chai";

describe("first_character", function() {
  it("should return the first charcter", function() {
    assert.equal(first_character("poo"), "p");
  });

  it("should return an empty string if an empty string is inputted", function() {
    assert.equal(first_character(""), "");
  });

  it("should ignore whitespace characters", function() {
    assert.equal(first_character("   a"), "a");
  });
});

describe("to_sentence_case", function() {
  it("should make a string into sentence case", function() {
    assert.equal(to_sentence_case("poo wEE"), "Poo wee");
  });

  it("should accept an empty string", function() {
    assert.equal(to_sentence_case(""), "");
  });

  it("should accept punctuation", function() {
    assert.equal(to_sentence_case("!pee"), "!Pee");
  });
});

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

describe("read_config_file", function() {
  it("reads a config file", function() {
    let expected_config = {
      base: "blah",
      input: "poo",
      output: { tex: { path: "output" } }
    };
    assert.deepEqual(
      read_config_file("tests/test-config.yaml"),
      expected_config
    );
  });
});

describe("separate_header", function() {
  it("separates the header", function() {
    let lines = ["---", "title: aaa", "artist: bbb", "---", "body1", "body2"];
    let expected_output = {
      header: ["title: aaa", "artist: bbb"],
      body: ["body1", "body2"]
    };
    assert.deepEqual(separate_header(lines), expected_output);
  });

  it("returns everything if there's no header", function() {
    let lines = ["a", "b", "c", "body"];
    let expected_output = {
      header: null,
      body: lines
    };
    assert.deepEqual(separate_header(lines), expected_output);
  });

  it("returns everything if there's an infinite header", function() {
    let lines = ["---", "a", "b", "c", "body"];
    let expected_output = {
      header: null,
      body: lines
    };
    assert.deepEqual(separate_header(lines), expected_output);
  });
});

describe("parse_line_chord", function() {
  it("parses a chord line", function() {
    assert.deepEqual(parse_line_chord(": C G   Am F"), ["C", "G", "Am", "F"]);
  });

  it("parses a chord line starting with whitespace", function() {
    assert.deepEqual(parse_line_chord("   : C G     "), ["C", "G"]);
  });

  it("parses a blank chord line as no chords", function() {
    assert.deepEqual(parse_line_chord("  :   "), []);
  });
});

describe("parse_body", function() {
  it("parses an example correctly", function() {
    let example_body =
      "# section\n: C Dm\nlyrics ^more ^ lyrics\n# new section \nlyrics and stuff";
    let expected_body = [
      {
        name: "Section",
        repeats: null,
        lines: [
          { chords: ["C", "Dm"], lyrics: ["lyrics ", "more ", " lyrics"] },
          { chords: null, lyrics: ["lyrics and stuff"] }
        ]
      },
      {
        name: "New section",
        repeats: null,
        lines: [{ chords: null, lyrics: ["lyrics and stuff"] }]
      }
    ];
    assert.deepEqual(parse_body(example_body), expected_body);
  });
});

describe("fix_path", function() {
  let fixed_path = "aaa/bbb/ccc.d"
  it("keeps UNIX path the same", function() {
    assert.equal(fix_path("aaa/bbb/ccc.d"), fixed_path);
  });

   it("Fixes Windows path", function() {
     assert.equal(fix_path("aaa\\bbb\\ccc.d"), fixed_path);
   });

    it("Fixes mixed path", function() {
      assert.equal(fix_path("aaa\\bbb/ccc.d"), fixed_path);
    });
});
