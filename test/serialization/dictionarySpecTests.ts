// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dictionarySpec from "../../lib/serialization/dictionarySpec";
import numberSpec from "../../lib/serialization/numberSpec";

describe("dictionarySpec", () => {
  it("should have \"Dictionary<T>\" for its typeName property", () => {
    assert.strictEqual("Dictionary<number>", dictionarySpec(numberSpec).typeName);
  });

  describe("serialize()", () => {
    it("should throw an error when given undefined", () => {
      try {
        dictionarySpec(numberSpec).serialize(["a", "property", "path"], undefined, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property a.property.path with value undefined must be an object.");
      }
    });

    it("should throw an error when given false", () => {
      try {
        dictionarySpec(numberSpec).serialize(["another", "property", "path"], false, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value false must be an object.");
      }
    });

    it("should throw an error when given []", () => {
      try {
        dictionarySpec(numberSpec).serialize(["another", "property", "path"], [], {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value [] must be an object.");
      }
    });

    it("should return the provided value with no error when given {}", () => {
      assert.deepEqual(dictionarySpec(numberSpec).serialize(["this", "one", "works"], {}, {}), {});
    });

    it("should throw an error when given {\"9\": \"9\"}", () => {
      try {
        dictionarySpec(numberSpec).serialize(["another", "property", "path"], {"9": "9"}, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path.9 with value \"9\" must be a number.");
      }

      it(`should return the provided value with no error when given {"1": 1, "2": 2}`, () => {
        assert.deepEqual(dictionarySpec(numberSpec).serialize(["this", "one", "works"], {"1": 1, "2": 2}, {}), {"1": 1, "2": 2});
      });
    });
  });
});