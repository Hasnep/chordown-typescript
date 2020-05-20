import { assert } from "chai";
import "mocha";
import { IConfig, read_config_file } from "../src/config";
const mock = require("mock-fs");

describe("read_config_file", () => {
  beforeEach(() => {
    mock({
      "config.toml": `[input]
path = "input/folder/**/*.cd"

[output.json]
path = "output/json"

[output.tex]
path = "output/tex"
compile = "latex"
`
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("reads a config file", () => {
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
    assert.deepEqual(read_config_file("config.toml"), expected_config);
  });
});
