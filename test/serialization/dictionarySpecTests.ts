// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dictionarySpec, { DictionaryType } from "../../lib/serialization/dictionarySpec";
import numberSpec from "../../lib/serialization/numberSpec";
import { TypeSpec } from "../../lib/serialization/typeSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("dictionarySpec", () => {
  it("should have \"Dictionary<T>\" for its specType property", () => {
    assert.strictEqual("Dictionary", dictionarySpec(numberSpec).specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dictionarySerializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { valueSpec: TypeSpec<TSerialized, TDeserialized>, value: DictionaryType<TDeserialized>, expectedResult: DictionaryType<TSerialized> | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: dictionarySpec(args.valueSpec),
          options: {
            serializationStrictTypeChecking: true
          },
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
    });

    describe("without strict type-checking", () => {
      function dictionarySerializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { valueSpec: TypeSpec<TSerialized, TDeserialized>, value: DictionaryType<TDeserialized>, expectedResult: DictionaryType<TSerialized> | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: dictionarySpec(args.valueSpec),
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an object.`]
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an object.`]
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: [] as any,
        expectedResult: [] as any,
        expectedLogs: [`WARNING: Property a.property.path with value [] should be an object.`]
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: {},
        expectedResult: {}
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "9": "9" } as any,
        expectedResult: { "9": "9" } as any,
        expectedLogs: [`WARNING: Property a.property.path.9 with value "9" should be a number.`]
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "1": 1, "2": 2 },
        expectedResult: { "1": 1, "2": 2 }
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function dictionaryDeserializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { valueSpec: TypeSpec<TSerialized, TDeserialized>, value: DictionaryType<TSerialized>, expectedResult: DictionaryType<TDeserialized> | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: dictionarySpec(args.valueSpec),
          options: {
            deserializationStrictTypeChecking: true
          },
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
    });

    describe("without strict type-checking", () => {
      function dictionaryDeserializeWithoutStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { valueSpec: TypeSpec<TSerialized, TDeserialized>, value: DictionaryType<TSerialized>, expectedResult: DictionaryType<TDeserialized> | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: dictionarySpec(args.valueSpec),
          options: {
            deserializationStrictTypeChecking: false
          },
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
    });
  });
});