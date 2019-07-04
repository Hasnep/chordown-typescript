import { assert } from "chai";
import "mocha";
import { parse_body, parse_line_chord, separate_header } from "../src/parser";

describe("separate_header", function() {
  it("separates the header", function() {
    const lines = ["---", "title: aaa", "artist: bbb", "---", "body1", "body2"];
    const expected_output = {
      header: ["title: aaa", "artist: bbb"],
      body: ["body1", "body2"],
    };
    assert.deepEqual(separate_header(lines), expected_output);
  });

  it("returns everything if there's no header", function() {
    const lines = ["a", "b", "c", "body"];
    const expected_output = {
      header: null,
      body: lines,
    };
    assert.deepEqual(separate_header(lines), expected_output);
  });

  it("returns everything if there's an infinite header", function() {
    const lines = ["---", "a", "b", "c", "body"];
    const expected_output = {
      header: null,
      body: lines,
    };
    assert.deepEqual(separate_header(lines), expected_output);
  });
});

it("separates the header when the first line is blank", function() {
  const lines = ["", "---", "title: aaa", "---", "body1", "body2"];
  const expected_output = {
    header: ["title: aaa"],
    body: ["body1", "body2"],
  };
  assert.deepEqual(separate_header(lines), expected_output);
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
    const example_body =
      "# section\n: C Dm\nlyrics ^more ^ lyrics\n# new section \nlyrics and stuff";
    const expected_body = [
      {
        name: "Section",
        repeats: null,
        lines: [
          { chords: ["C", "Dm"], lyrics: ["lyrics ", "more ", " lyrics"] },
          { chords: null, lyrics: ["lyrics and stuff"] },
        ],
      },
      {
        name: "New section",
        repeats: null,
        lines: [{ chords: null, lyrics: ["lyrics and stuff"] }],
      },
    ];

    const parsed_body = parse_body(example_body);
    assert.deepEqual(parsed_body, expected_body);
  });

  it("remembers chords from a previous verse", function() {
    const example_body =
      "# verse\n: C G\nlyrics ^more ^ lyrics\n# verse \nlyrics ^and ^ stuff";
    const expected_body = [
      {
        name: "Verse",
        repeats: null,
        lines: [{ chords: ["C", "G"], lyrics: ["lyrics ", "more ", " lyrics"] }],
      },
      {
        name: "Verse",
        repeats: null,
        lines: [{ chords: ["C", "G"], lyrics: ["lyrics ", "and ", " stuff"] }],
      },
    ];
    const parsed_body = parse_body(example_body);
    assert.deepEqual(parsed_body, expected_body);
  });
});

describe("is_line_blank", function() {
  it("returns true for blank lines", function() {
    assert.isTrue(
      is_line_blank({
        chords: null,
        lyrics: null,
      }),
    );
  });

  it("returns false for lines with chords", function() {
    assert.isFalse(
      is_line_blank({
        chords: ["C"],
        lyrics: null,
      }),
    );
  });

  it("returns false for lines with lyrics", function() {
    assert.isFalse(
      is_line_blank({
        chords: null,
        lyrics: ["lyric"],
      }),
    );
  });
});

describe("is_section_blank", function() {
  it("returns true for blank sections", function() {
    assert.isTrue(
      is_section_blank({
        name: null,
        repeats: null,
        lines: [],
      }),
    );
  });

  it("returns true for named but blank sections", function() {
    assert.isTrue(
      is_section_blank({
        name: "test",
        repeats: null,
        lines: [],
      }),
    );
  });

  it("returns false for sections with lines", function() {
    assert.isFalse(
      is_section_blank({
        name: null,
        repeats: null,
        lines: [{ chords: ["x", "y"], lyrics: ["C"] }],
      }),
    );
  });
});
