import { assert } from "chai";
import "mocha";
import { first_character, to_sentence_case } from "../src/string-functions";

describe("first_character", () => {
  it("should return the first charcter", () => {
    assert.equal(first_character("poo"), "p");
  });

  it("should return an empty string if an empty string is inputted", () => {
    assert.equal(first_character(""), "");
  });

  it("should ignore whitespace characters", () => {
    assert.equal(first_character("   a"), "a");
  });
});

describe("to_sentence_case", () => {
  it("should make a string into sentence case", () => {
    assert.equal(to_sentence_case("poo wEE"), "Poo wee");
  });

  it("should accept an empty string", () => {
    assert.equal(to_sentence_case(""), "");
  });

  it("should accept punctuation", () => {
    assert.equal(to_sentence_case("!pee"), "!Pee");
  });
});
