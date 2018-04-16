// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { enumSpec } from "../../lib/serialization/enumSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("enumSpec", () => {
  it("should have \"Enum\" for its specType property", () => {
    assert.strictEqual("Enum", enumSpec("Letters", []).specType);
  });

  it("should have the correct enumName property", () => {
    assert.strictEqual("Letters", enumSpec("Letters", []).enumName);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function enumSerializeWithStrictTypeCheckingTest<T>(args: { allowedValues: T[], value: T, expectedResult: T | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: enumSpec("Letters", args.allowedValues),
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      enumSerializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be one of the enum allowed values: ["a","b","c"].`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be one of the enum allowed values: ["a","b","c"].`]
      });

      enumSerializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "" as any,
        expectedResult: new Error(`Property a.property.path with value "" must be one of the enum allowed values: ["a","b","c"].`),
        expectedLogs: [`ERROR: Property a.property.path with value "" must be one of the enum allowed values: ["a","b","c"].`]
      });

      enumSerializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "a",
        expectedResult: "a"
      });

      enumSerializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "A",
        expectedResult: "A"
      });
    });

    describe("without strict type-checking", () => {
      function enumSerializeWithoutStrictTypeCheckingTest<T>(args: { allowedValues: T[], value: T, expectedResult: T | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: enumSpec("Letters", args.allowedValues),
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      enumSerializeWithoutStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be one of the enum allowed values: ["a","b","c"].`]
      });

      enumSerializeWithoutStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "" as any,
        expectedResult: "" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "" should be one of the enum allowed values: ["a","b","c"].`]
      });

      enumSerializeWithoutStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "a",
        expectedResult: "a"
      });

      enumSerializeWithoutStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "A",
        expectedResult: "A"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function enumDeserializeWithStrictTypeCheckingTest<T>(args: { allowedValues: T[], value: T, expectedResult: T | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: enumSpec("Letters", args.allowedValues),
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      enumDeserializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be one of the enum allowed values: ["a","b","c"].`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be one of the enum allowed values: ["a","b","c"].`]
      });

      enumDeserializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "" as any,
        expectedResult: new Error(`Property a.property.path with value "" must be one of the enum allowed values: ["a","b","c"].`),
        expectedLogs: [`ERROR: Property a.property.path with value "" must be one of the enum allowed values: ["a","b","c"].`]
      });

      enumDeserializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "a",
        expectedResult: "a"
      });

      enumDeserializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "A",
        expectedResult: "A"
      });
    });

    describe("without strict type-checking", () => {
      function enumDeserializeWithoutStrictTypeCheckingTest<T>(args: { allowedValues: T[], value: T, expectedResult: T | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: enumSpec("Letters", args.allowedValues),
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      enumDeserializeWithoutStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be one of the enum allowed values: ["a","b","c"].`]
      });

      enumDeserializeWithoutStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "" as any,
        expectedResult: "" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "" should be one of the enum allowed values: ["a","b","c"].`]
      });

      enumDeserializeWithoutStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "a",
        expectedResult: "a"
      });

      enumDeserializeWithoutStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "A",
        expectedResult: "A"
      });
    });
  });
});