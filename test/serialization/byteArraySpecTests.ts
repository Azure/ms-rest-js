// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import byteArraySpec from "../../lib/serialization/byteArraySpec";

describe("byteArraySpec", () => {
  it("should have \"ByteArray\" for its typeName property", () => {
    assert.strictEqual("ByteArray", byteArraySpec.typeName);
  });

  describe("serialize()", () => {
    it("should throw an error when given undefined", () => {
      try {
        byteArraySpec.serialize(["a", "property", "path"], <any>undefined, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property a.property.path with value undefined must be a Buffer.");
      }
    });

    it("should throw an error when given 5", () => {
      try {
        byteArraySpec.serialize(["another", "property", "path"], <any>5, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value 5 must be a Buffer.");
      }
    });

    it("should throw an error when given {}", () => {
      try {
        byteArraySpec.serialize(["another", "property", "path"], <any>{}, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value {} must be a Buffer.");
      }
    });

    it("should return a base64 encoded string with no error when given a Buffer", () => {
      assert.strictEqual(byteArraySpec.serialize(["this", "one", "works"], new Buffer([0, 1, 2, 3, 4]), {}), "AAECAwQ=");
    });
  });

  describe("deserialize()", () => {
    it("should throw an error when given undefined", () => {
      try {
        byteArraySpec.deserialize(["a", "property", "path"], <any>undefined, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property a.property.path with value undefined must be a Buffer.");
      }
    });

    it("should throw an error when given 5", () => {
      try {
        byteArraySpec.deserialize(["another", "property", "path"], <any>5, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value 5 must be a Buffer.");
      }
    });

    it("should throw an error when given {}", () => {
      try {
        byteArraySpec.deserialize(["another", "property", "path"], <any>{}, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value {} must be a Buffer.");
      }
    });

    it("should return a base64 encoded string with no error when given a Buffer", () => {
      assert.strictEqual(byteArraySpec.deserialize(["this", "one", "works"], "AAECAwQ=", {}), new Buffer([0, 1, 2, 3, 4]));
    });
  });
});