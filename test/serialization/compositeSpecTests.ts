// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { compositeSpec } from "../../lib/serialization/compositeSpec";
import booleanSpec from "../../lib/serialization/booleanSpec";
import numberSpec from "../../lib/serialization/numberSpec";
import stringSpec from "../../lib/serialization/stringSpec";
import { SerializationOutputType } from "../../lib/serialization/serializationOptions";
import sequenceSpec from "../../lib/serialization/sequenceSpec";

describe("compositeSpec", () => {
  it("should have \"Composite\" for its typeName property", () => {
    assert.strictEqual("Composite<Spam>", compositeSpec("Spam", {}).typeName);
  });

  describe("serialize()", () => {
    it("should throw an error when given undefined", () => {
      try {
        compositeSpec("Spam", {}).serialize(["a", "property", "path"], undefined, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property a.property.path with value undefined must be an object.");
      }
    });

    it("should throw an error when given false", () => {
      try {
        compositeSpec("Spam", {}).serialize(["another", "property", "path"], false, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value false must be an object.");
      }
    });

    it("should throw an error when given []", () => {
      try {
        compositeSpec("Spam", {}).serialize(["another", "property", "path"], [], {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path with value [] must be an object.");
      }
    });

    it("should return the provided value with no error when given {}", () => {
      assert.deepEqual(compositeSpec("Spam", {}).serialize(["this", "one", "works"], {}, {}), {});
    });

    it("should throw an error when the value has a missing required property", () => {
      try {
        compositeSpec("Spam", { "tasty?": { required: true, valueSpec: booleanSpec } }).serialize(["another", "property", "path"], {}, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Missing non-constant boolean property at another.property.path.tasty?.");
      }
    });

    it("should throw an error when the value has a property with the wrong type", () => {
      try {
        compositeSpec("Spam", { "tasty?": { valueSpec: booleanSpec } }).serialize(["another", "property", "path"], { "tasty?": 2 }, {});
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.strictEqual(error.message, "Property another.property.path.tasty? with value 2 must be a boolean.");
      }
    });

    it("should return the provided value without properties not in the property specification", () => {
      assert.deepEqual(compositeSpec("Spam", { "age": { valueSpec: numberSpec }}).serialize(["this", "one", "works"], { "height": "tall", "age": 30 }, {}), { "age": 30 });
    });

    it("should return the correct flattened serialization for JSON", () => {
      const spec = compositeSpec("Letters", {
        "a": {
          serializedName: "A.B.C",
          valueSpec: numberSpec
        },
        "b": {
          serializedName: "A.B.D",
          valueSpec: sequenceSpec(booleanSpec)
        },
        "c": {
          serializedName: "A.E",
          valueSpec: stringSpec
        }
      });

      const value = {
        "a": 5,
        "b": [ true, false, true ],
        "c": "test"
      };

      const expected = {
        "A": {
          "B": {
            "C": 5,
            "D": [ true, false, true ]
          },
          "E": "test"
        }
      };

      assert.deepStrictEqual(spec.serialize(["this", "one", "works"], value, {}), expected);
    });

    it("should return the correct XML serialization", () => {
      const spec = compositeSpec("Letters", {
        "a": {
          xmlIsAttribute: true,
          xmlName: "a",
          valueSpec: numberSpec
        },
        "b": {
          xmlIsWrapped: true,
          xmlElementName: "bool",
          xmlName: "bools",
          valueSpec: sequenceSpec(booleanSpec)
        },
        "c": {
          xmlName: "spam",
          valueSpec: stringSpec
        }
      });

      const value = {
        "a": 5,
        "b": [ true, false, true ],
        "c": "test"
      };

      const expected = {
        $: {
          "a": 5
        },
        "bools": {
          "bool": [ true, false, true ]
        },
        "spam": "test"
      };

      assert.deepStrictEqual(spec.serialize(["this", "one", "works"], value, { outputType: SerializationOutputType.XML }), expected);
    });

    it("should return the correct flattened serialization for XML", () => {
      const spec = compositeSpec("Letters", {
        "a": {
          xmlIsAttribute: true,
          xmlName: "A",
          valueSpec: numberSpec
        },
        "b": {
          xmlIsWrapped: true,
          xmlElementName: "bool",
          xmlName: "b.o.o.l.s",
          valueSpec: sequenceSpec(booleanSpec)
        },
        "c": {
          xmlName: "A.E",
          valueSpec: stringSpec
        }
      });

      const value = {
        "a": 5,
        "b": [ true, false, true ],
        "c": "test"
      };

      const expected = {
        "$": {
          "A": 5
        },
        "b": {
          "o": {
            "o": {
              "l": {
                "s": {
                  "bool": [ true, false, true ]
                }
              }
            }
          }
        },
        "A": {
          "E": "test"
        }
      };

      assert.deepStrictEqual(spec.serialize(["this", "one", "works"], value, { outputType: SerializationOutputType.XML }), expected);
    });
  });
});