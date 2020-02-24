import { assert } from "chai";
import "mocha";
import { escape_tex } from "../src/exporters/tex";

describe("escape_tex", function() {
  it("Escapes ampersands", function() {
    assert.equal(escape_tex("abc&def"), "abc\\&def");
  });
});
