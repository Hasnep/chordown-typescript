import { assert } from "chai";
import "mocha";
import { escape_tex } from "../src/exporters/tex";

describe("escape_tex", () => {
  it("Escapes ampersands", () => {
    assert.equal(escape_tex("abc&def"), "abc\\&def");
  });
});
