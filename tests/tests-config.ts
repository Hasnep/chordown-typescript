import { read_config_file } from "../src/config";
import "mocha";
import { assert } from "chai";

describe("read_config_file", function() {
  it("reads a config file", function() {
    let expected_config = {
      base: "~/aaa/bbb/",
      input: "ccc/",
      output: {
        json: { path: "ddd/" },
        tex: { path: "eee/", compile: "xelatex" }
      }
    };
    assert.deepEqual(
      read_config_file("tests/test-config.yaml"),
      expected_config
    );
  });
});
