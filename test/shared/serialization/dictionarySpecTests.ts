// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { DictionaryType, dictionarySpec } from "../../../lib/serialization/dictionarySpec";
import numberSpec from "../../../lib/serialization/numberSpec";
import { TypeSpec } from "../../../lib/serialization/typeSpec";
import { deserializeTest, serializeTest } from "./specTest";
import { SerializationOptions } from "../../../lib/serialization/serializationOptions";
import { stringSpec, compositeSpec } from "../../../lib/msRest";

describe("dictionarySpec", () => {
  it("should have \"Dictionary<T>\" for its specType property", () => {
    assert.strictEqual("Dictionary", dictionarySpec(numberSpec).specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dictionarySerializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { testName?: string, valueSpec: TypeSpec<TSerialized, TDeserialized> | string, value: DictionaryType<TDeserialized>, options?: SerializationOptions, expectedResult: DictionaryType<TSerialized> | Error, expectedLogs?: string[] }): void {
        const options: SerializationOptions = args.options || {};
        options.serializationStrictTypeChecking = true;

        serializeTest({
          testName: args.testName,
          typeSpec: dictionarySpec(args.valueSpec),
          options: options,
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an object.`]
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an object.`]
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: [] as any,
        expectedResult: new Error("Property a.property.path with value [] must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be an object.`]
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: {},
        expectedResult: {}
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "9": "9" } as any,
        expectedResult: new Error(`Property a.property.path.9 with value "9" must be a number.`),
        expectedLogs: [`ERROR: Property a.property.path.9 with value "9" must be a number.`]
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "1": 1, "2": 2 },
        expectedResult: { "1": 1, "2": 2 }
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: "CompositeRef",
        value: {
          "A": {
            "b": "B"
          }
        },
        options: {
          compositeSpecDictionary: {
            "CompositeRef": compositeSpec({
              typeName: "CompositeRef",
              propertySpecs: {
                "b": {
                  valueSpec: stringSpec
                }
              }
            })
          }
        },
        expectedResult: {
          "A": {
            "b": "B"
          }
        }
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when a composite spec reference doesn't exist in composite spec dictionary",
        valueSpec: "NotFound",
        value: {
          "A": "B doesn't exist in the composite TypeSpec dictionary"
        },
        options: {
          compositeSpecDictionary: {}
        },
        expectedResult: new Error(`Missing composite specification entry in composite type dictionary for type named "NotFound" at a.property.path.`),
        expectedLogs: [`ERROR: Missing composite specification entry in composite type dictionary for type named "NotFound" at a.property.path.`]
      });
    });

    describe("without strict type-checking", () => {
      function dictionarySerializeWithoutStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { testName?: string, valueSpec: TypeSpec<TSerialized, TDeserialized> | string, value: DictionaryType<TDeserialized>, options?: SerializationOptions, expectedResult: DictionaryType<TSerialized> | Error, expectedLogs?: string[] }): void {
        const options: SerializationOptions = args.options || {};
        options.serializationStrictTypeChecking = false;

        serializeTest({
          testName: args.testName,
          typeSpec: dictionarySpec(args.valueSpec),
          options: options,
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dictionarySerializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an object.`]
      });

      dictionarySerializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an object.`]
      });

      dictionarySerializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: [] as any,
        expectedResult: [] as any,
        expectedLogs: [`WARNING: Property a.property.path with value [] should be an object.`]
      });

      dictionarySerializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: {},
        expectedResult: {}
      });

      dictionarySerializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "9": "9" } as any,
        expectedResult: { "9": "9" } as any,
        expectedLogs: [`WARNING: Property a.property.path.9 with value "9" should be a number.`]
      });

      dictionarySerializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "1": 1, "2": 2 },
        expectedResult: { "1": 1, "2": 2 }
      });

      dictionarySerializeWithoutStrictTypeCheckingTest({
        valueSpec: "CompositeRef",
        value: {
          "A": {
            "b": "B"
          }
        },
        options: {
          compositeSpecDictionary: {
            "CompositeRef": compositeSpec({
              typeName: "CompositeRef",
              propertySpecs: {
                "b": {
                  valueSpec: stringSpec
                }
              }
            })
          }
        },
        expectedResult: {
          "A": {
            "b": "B"
          }
        }
      });

      dictionarySerializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when a composite spec reference doesn't exist in composite spec dictionary",
        valueSpec: "NotFound",
        value: {
          "A": "B doesn't exist in the composite TypeSpec dictionary"
        },
        options: {
          compositeSpecDictionary: {}
        },
        expectedResult: new Error(`Missing composite specification entry in composite type dictionary for type named "NotFound" at a.property.path.`),
        expectedLogs: [`ERROR: Missing composite specification entry in composite type dictionary for type named "NotFound" at a.property.path.`]
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function dictionaryDeserializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { testName?: string, valueSpec: TypeSpec<TSerialized, TDeserialized> | string, value: DictionaryType<TSerialized>, options?: SerializationOptions, expectedResult: DictionaryType<TDeserialized> | Error, expectedLogs?: string[] }): void {
        const options: SerializationOptions = args.options || {};
        options.deserializationStrictTypeChecking = true;

        deserializeTest({
          testName: args.testName,
          typeSpec: dictionarySpec(args.valueSpec),
          options: options,
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dictionaryDeserializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an object.`]
      });

      dictionaryDeserializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an object.`]
      });

      dictionaryDeserializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: [] as any,
        expectedResult: new Error("Property a.property.path with value [] must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be an object.`]
      });

      dictionaryDeserializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: {},
        expectedResult: {}
      });

      dictionaryDeserializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "9": "9" } as any,
        expectedResult: new Error(`Property a.property.path.9 with value "9" must be a number.`),
        expectedLogs: [`ERROR: Property a.property.path.9 with value "9" must be a number.`]
      });

      dictionaryDeserializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "1": 1, "2": 2 },
        expectedResult: { "1": 1, "2": 2 }
      });

      dictionaryDeserializeWithStrictTypeCheckingTest({
        valueSpec: "CompositeRef",
        value: {
          "A": {
            "b": "B"
          }
        },
        options: {
          compositeSpecDictionary: {
            "CompositeRef": compositeSpec({
              typeName: "CompositeRef",
              propertySpecs: {
                "b": {
                  valueSpec: stringSpec
                }
              }
            })
          }
        },
        expectedResult: {
          "A": {
            "b": "B"
          }
        }
      });

      dictionaryDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when a composite spec reference doesn't exist in composite spec dictionary",
        valueSpec: "NotFound",
        value: {
          "A": "B doesn't exist in the composite TypeSpec dictionary"
        },
        options: {
          compositeSpecDictionary: {}
        },
        expectedResult: new Error(`Missing composite specification entry in composite type dictionary for type named "NotFound" at a.property.path.`),
        expectedLogs: [`ERROR: Missing composite specification entry in composite type dictionary for type named "NotFound" at a.property.path.`]
      });
    });

    describe("without strict type-checking", () => {
      function dictionaryDeserializeWithoutStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { testName?: string, valueSpec: TypeSpec<TSerialized, TDeserialized> | string, value: DictionaryType<TSerialized>, options?: SerializationOptions, expectedResult: DictionaryType<TDeserialized> | Error, expectedLogs?: string[] }): void {
        const options: SerializationOptions = args.options || {};
        options.deserializationStrictTypeChecking = false;

        deserializeTest({
          testName: args.testName,
          typeSpec: dictionarySpec(args.valueSpec),
          options: options,
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dictionaryDeserializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an object.`]
      });

      dictionaryDeserializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an object.`]
      });

      dictionaryDeserializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: [] as any,
        expectedResult: [] as any,
        expectedLogs: [`WARNING: Property a.property.path with value [] should be an object.`]
      });

      dictionaryDeserializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: {},
        expectedResult: {}
      });

      dictionaryDeserializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "9": "9" } as any,
        expectedResult: { "9": "9" } as any,
        expectedLogs: [`WARNING: Property a.property.path.9 with value "9" should be a number.`]
      });

      dictionaryDeserializeWithoutStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "1": 1, "2": 2 },
        expectedResult: { "1": 1, "2": 2 }
      });

      dictionaryDeserializeWithoutStrictTypeCheckingTest({
        valueSpec: "CompositeRef",
        value: {
          "A": {
            "b": "B"
          }
        },
        options: {
          compositeSpecDictionary: {
            "CompositeRef": compositeSpec({
              typeName: "CompositeRef",
              propertySpecs: {
                "b": {
                  valueSpec: stringSpec
                }
              }
            })
          }
        },
        expectedResult: {
          "A": {
            "b": "B"
          }
        }
      });

      dictionaryDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when a composite spec reference doesn't exist in composite spec dictionary",
        valueSpec: "NotFound",
        value: {
          "A": "B doesn't exist in the composite TypeSpec dictionary"
        },
        options: {
          compositeSpecDictionary: {}
        },
        expectedResult: new Error(`Missing composite specification entry in composite type dictionary for type named "NotFound" at a.property.path.`),
        expectedLogs: [`ERROR: Missing composite specification entry in composite type dictionary for type named "NotFound" at a.property.path.`]
      });
    });
  });
});
