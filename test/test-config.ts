import { assert } from "chai";
import "mocha";
import { IConfig, read_config_file, combine_configs } from "../src/config";
import * as mock from "mock-fs";

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

describe("combine_configs", () => {
  it("combines configs", () => {
    const first_config: object = { x: 1, y: 2, a: { i: 1, j: 2 } };
    const second_config: object = {
      y: "new2",
      z: "new3",
      a: { j: 12, k: 13 }
    };
    const expected_output: object = {
      x: 1,
      y: "new2",
      z: "new3",
      a: { i: 1, j: 12, k: 13 }
    };
    assert.deepEqual(
      combine_configs(first_config, second_config),
      expected_output
    );
  });
});

describe("recursive_find_config", () => {
  it("", () => {
    assert.equal(1, 1);
  });
});
