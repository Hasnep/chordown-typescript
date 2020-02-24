import { assert } from "chai";
import "mocha";
import { IConfig, read_config_file } from "../src/config";

describe("read_config_file", function() {
  it("reads a config file", function() {
    const expected_config: IConfig = {
      input: {
        path: "input/folder/**/*.cd"
      },
      output: {
        json: {
          path: "output/json"
        },
        tex: {
          path: "output/tex",
          compile: "latex"
        }
      }
    };
    assert.deepEqual(
      read_config_file("test/test-config.toml"),
      expected_config
    );
  });
});
