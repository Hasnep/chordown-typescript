import { assert } from "chai";
import "mocha";
import { IConfig, IConfigOutputs, read_config_file } from "../src/config";

describe("read_config_file", function() {
  it("reads a config file", function() {
    const expected_config: IConfig = {
      base: "~/aaa/bbb/",
      input: "ccc/",
      output: {
        json: { path: "ddd/" },
        tex: { path: "eee/", compile: "xelatex" },
      },
    };
    assert.deepEqual(
      read_config_file("tests/test-config.yaml"),
      expected_config,
    );
  });
});
