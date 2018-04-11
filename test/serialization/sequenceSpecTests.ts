// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import sequenceSpec from "../../lib/serialization/sequenceSpec";
import stringSpec from "../../lib/serialization/stringSpec";

describe("sequenceSpec", () => {
  it("should have \"Sequence<T>\" for its typeName property", () => {
    assert.strictEqual("Sequence<string>", sequenceSpec(stringSpec).typeName);
  });

  describe("serialize()", () => {
    it("should throw an error when given undefined", () => {
      try {
        sequenceSpec(stringSpec).serialize(["a", "property", "path"], undefined);
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property a.property.path with value undefined must be an Array.");
      }
    });

    it("should throw an error when given false", () => {
      try {
        sequenceSpec(stringSpec).serialize(["another", "property", "path"], false);
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value false must be an Array.");
      }
    });

    it("should throw an error when given {}", () => {
      try {
        sequenceSpec(stringSpec).serialize(["another", "property", "path"], {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value {} must be an Array.");
      }
    });

    it("should return the provided value with no error when given []", () => {
      assert.deepEqual(sequenceSpec(stringSpec).serialize(["this", "one", "works"], []), []);
    });

    it("should throw an error when given [9]", () => {
      try {
        sequenceSpec(stringSpec).serialize(["another", "property", "path"], [9]);
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path.0 with value 9 must be a string.");
      }

      it(`should return the provided value with no error when given ["a"]`, () => {
        assert.deepEqual(sequenceSpec(stringSpec).serialize(["this", "one", "works"], ["a"]), ["a"]);
      });
    });
  });
});