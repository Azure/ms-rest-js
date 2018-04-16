// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import booleanSpec from "../../lib/serialization/booleanSpec";
import { compositeSpec, CompositeType, PropertySpec } from "../../lib/serialization/compositeSpec";
import numberSpec from "../../lib/serialization/numberSpec";
import sequenceSpec from "../../lib/serialization/sequenceSpec";
import { SerializationOptions, SerializationOutputType } from "../../lib/serialization/serializationOptions";
import stringSpec from "../../lib/serialization/stringSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("compositeSpec", () => {
  it("should have \"Composite\" for its specType property", () => {
    assert.strictEqual("Composite", compositeSpec("Spam", {}).specType);
  });

  it("should have the correct typeName property", () => {
    assert.strictEqual("Spam", compositeSpec("Spam", {}).typeName);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function compositeSerializeWithStrictTypeCheckingTest(args: { testName?: string, typeName?: string, propertySpecs?: { [propertyName: string]: PropertySpec }, propertyPath?: string[], value: CompositeType, options?: SerializationOptions, expectedResult: CompositeType | Error }): void {
        const options: SerializationOptions = args.options || {};
        options.serializationStrictTypeChecking = true;

        serializeTest({
          testName: args.testName,
          typeSpec: compositeSpec(args.typeName || "Spam", args.propertySpecs || {}),
          propertyPath: args.propertyPath,
          options: options,
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      compositeSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be an object.")
      });

      compositeSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error("Property a.property.path with value false must be an object.")
      });

      compositeSerializeWithStrictTypeCheckingTest({
        value: <any>[],
        expectedResult: new Error("Property a.property.path with value [] must be an object.")
      });

      compositeSerializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should throw an error when a required property is missing`,
        propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } },
        value: {},
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.tasty?.")
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should throw an error when a property has the wrong type`,
        propertySpecs: { "tasty?": { valueSpec: booleanSpec } },
        value: { "tasty?": 2 },
        expectedResult: new Error("Property a.property.path.tasty? with value 2 must be a boolean.")
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should drop properties that exist on the value but not in the specification`,
        propertySpecs: { "age": { valueSpec: numberSpec } },
        value: { "age": 30, "height": "tall" },
        expectedResult: { "age": 30 }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should return the correct flattened serialization for JSON`,
        propertySpecs: {
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
        },
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        expectedResult: {
          "A": {
            "B": {
              "C": 5,
              "D": [true, false, true]
            },
            "E": "test"
          }
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should return the correct XML serialization`,
        propertySpecs: {
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
        },
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          $: {
            "a": 5
          },
          "bools": {
            "bool": [true, false, true]
          },
          "spam": "test"
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for XML",
        propertySpecs: {
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
        },
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "$": {
            "A": 5
          },
          "b": {
            "o": {
              "o": {
                "l": {
                  "s": {
                    "bool": [true, false, true]
                  }
                }
              }
            }
          },
          "A": {
            "E": "test"
          }
        }
      });

      const recursiveCompositeSpec = compositeSpec("Letters", {
        "A": {
          valueSpec: stringSpec
        },
        "B": {
          valueSpec: "Letters"
        }
      });
      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should support recursive specs in JSON`,
        propertySpecs: recursiveCompositeSpec.propertySpecs,
        value: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        },
        options: {
          compositeSpecDictionary: {
            "Letters": recursiveCompositeSpec
          }
        },
        expectedResult: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        }
      });
    });

    describe("without strict type-checking", () => {
      function compositeSerializeWithoutStrictTypeCheckingTest(args: { testName?: string, typeName?: string, propertySpecs?: { [propertyName: string]: PropertySpec }, propertyPath?: string[], value: CompositeType, options?: SerializationOptions, expectedResult: CompositeType | Error }): void {
        const options: SerializationOptions = args.options || {};
        options.serializationStrictTypeChecking = false;

        serializeTest({
          testName: args.testName,
          typeSpec: compositeSpec(args.typeName || "Spam", args.propertySpecs || {}),
          propertyPath: args.propertyPath,
          options: options,
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      compositeSerializeWithoutStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: <any>undefined
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: <any>false
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        value: <any>[],
        expectedResult: <any>[]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should throw an error when a required property is missing`,
        propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } },
        value: {},
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.tasty?.")
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should throw an error when a property has the wrong type`,
        propertySpecs: { "tasty?": { valueSpec: booleanSpec } },
        value: { "tasty?": 2 },
        expectedResult: { "tasty?": 2 }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should drop properties that exist on the value but not in the specification`,
        propertySpecs: { "age": { valueSpec: numberSpec } },
        value: { "age": 30, "height": "tall" },
        expectedResult: { "age": 30 }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should return the correct flattened serialization for JSON`,
        propertySpecs: {
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
        },
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        expectedResult: {
          "A": {
            "B": {
              "C": 5,
              "D": [true, false, true]
            },
            "E": "test"
          }
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should return the correct XML serialization`,
        propertySpecs: {
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
        },
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          $: {
            "a": 5
          },
          "bools": {
            "bool": [true, false, true]
          },
          "spam": "test"
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for XML",
        propertySpecs: {
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
        },
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "$": {
            "A": 5
          },
          "b": {
            "o": {
              "o": {
                "l": {
                  "s": {
                    "bool": [true, false, true]
                  }
                }
              }
            }
          },
          "A": {
            "E": "test"
          }
        }
      });

      const recursiveCompositeSpec = compositeSpec("Letters", {
        "A": {
          valueSpec: stringSpec
        },
        "B": {
          valueSpec: "Letters"
        }
      });
      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should support recursive specs in JSON`,
        propertySpecs: recursiveCompositeSpec.propertySpecs,
        value: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        },
        options: {
          compositeSpecDictionary: {
            "Letters": recursiveCompositeSpec
          }
        },
        expectedResult: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        }
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function compositeDeserializeWithStrictTypeCheckingTest(args: { testName?: string, typeName?: string, propertySpecs?: { [propertyName: string]: PropertySpec }, propertyPath?: string[], value: CompositeType, options?: SerializationOptions, expectedResult: CompositeType | Error }): void {
        const options: SerializationOptions = args.options || {};
        options.deserializationStrictTypeChecking = true;

        deserializeTest({
          testName: args.testName,
          typeSpec: compositeSpec(args.typeName || "Spam", args.propertySpecs || {}),
          propertyPath: args.propertyPath,
          options: options,
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      compositeDeserializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be an object.")
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error("Property a.property.path with value false must be an object.")
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        value: <any>[],
        expectedResult: new Error("Property a.property.path with value [] must be an object.")
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should throw an error when the value has a missing required property",
        propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } },
        value: {},
        options: {
          deserializationStrictMissingProperties: true
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.tasty?.")
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should throw an error when the value has a property with the wrong type",
        propertySpecs: { "tasty?": { valueSpec: booleanSpec } },
        value: { "tasty?": 2 },
        expectedResult: new Error("Property a.property.path.tasty? with value 2 must be a boolean.")
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should return the provided value without properties not in the property specification",
        propertySpecs: { "age": { valueSpec: numberSpec } },
        value: { "height": "tall", "age": 30 },
        expectedResult: { "age": 30 }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for JSON",
        propertySpecs: {
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
        },
        value: {
          "A": {
            "B": {
              "C": 5,
              "D": [true, false, true]
            },
            "E": "test"
          }
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should return the correct XML serialization",
        propertySpecs: {
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
        },
        value: {
          $: {
            "a": 5
          },
          "bools": {
            "bool": [true, false, true]
          },
          "spam": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for XML",
        propertySpecs: {
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
        },
        value: {
          "$": {
            "A": 5
          },
          "b": {
            "o": {
              "o": {
                "l": {
                  "s": {
                    "bool": [true, false, true]
                  }
                }
              }
            }
          },
          "A": {
            "E": "test"
          }
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      const recursiveCompositeSpec = compositeSpec("Letters", {
        "A": {
          valueSpec: stringSpec
        },
        "B": {
          valueSpec: "Letters"
        }
      });
      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should support recursive specs in JSON",
        propertySpecs: recursiveCompositeSpec.propertySpecs,
        value: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        },
        options: {
          compositeSpecDictionary: {
            "Letters": recursiveCompositeSpec
          }
        },
        expectedResult: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        }
      });
    });

    describe("without strict type-checking", () => {
      function compositeDeserializeWithoutStrictTypeCheckingTest(args: { testName?: string, typeName?: string, propertySpecs?: { [propertyName: string]: PropertySpec }, propertyPath?: string[], value: CompositeType, options?: SerializationOptions, expectedResult: CompositeType | Error }): void {
        const options: SerializationOptions = args.options || {};
        options.deserializationStrictTypeChecking = false;

        deserializeTest({
          testName: args.testName,
          typeSpec: compositeSpec(args.typeName || "Spam", args.propertySpecs || {}),
          propertyPath: args.propertyPath,
          options: options,
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      compositeDeserializeWithoutStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: <any>undefined
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: <any>false
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        value: <any>[],
        expectedResult: <any>[]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should throw an error when the value has a missing required property",
        propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } },
        value: {},
        options: {
          deserializationStrictMissingProperties: true
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.tasty?.")
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should throw an error when the value has a property with the wrong type",
        propertySpecs: { "tasty?": { valueSpec: booleanSpec } },
        value: { "tasty?": 2 },
        expectedResult: { "tasty?": 2 }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should return the provided value without properties not in the property specification",
        propertySpecs: { "age": { valueSpec: numberSpec } },
        value: { "height": "tall", "age": 30 },
        expectedResult: { "age": 30 }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for JSON",
        propertySpecs: {
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
        },
        value: {
          "A": {
            "B": {
              "C": 5,
              "D": [true, false, true]
            },
            "E": "test"
          }
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should return the correct XML serialization",
        propertySpecs: {
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
        },
        value: {
          $: {
            "a": 5
          },
          "bools": {
            "bool": [true, false, true]
          },
          "spam": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for XML",
        propertySpecs: {
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
        },
        value: {
          "$": {
            "A": 5
          },
          "b": {
            "o": {
              "o": {
                "l": {
                  "s": {
                    "bool": [true, false, true]
                  }
                }
              }
            }
          },
          "A": {
            "E": "test"
          }
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      const recursiveCompositeSpec = compositeSpec("Letters", {
        "A": {
          valueSpec: stringSpec
        },
        "B": {
          valueSpec: "Letters"
        }
      });
      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should support recursive specs in JSON",
        propertySpecs: recursiveCompositeSpec.propertySpecs,
        value: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        },
        options: {
          compositeSpecDictionary: {
            "Letters": recursiveCompositeSpec
          }
        },
        expectedResult: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        }
      });
    });
  });
});