// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import stringSpec from "../../../lib/serialization/stringSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("stringSpec", () => {
  it("should have \"string\" for its typeName property", () => {
    assert.strictEqual("string", stringSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function stringSerializeWithStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: stringSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      stringSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be a string.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a string.`]
      });

      stringSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be a string.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a string.`]
      });

      stringSerializeWithStrictTypeCheckingTest({
        value: "abc",
        expectedResult: "abc"
      });
    });

    describe("without strict type-checking", () => {
      function stringSerializeWithoutStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: stringSpec,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      stringSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a string.`]
      });

      stringSerializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a string.`]
      });

      stringSerializeWithoutStrictTypeCheckingTest({
        value: "abc",
        expectedResult: "abc"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function stringDeserializeWithStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: stringSpec,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      stringDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be a string.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a string.`]
      });

      stringDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be a string.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a string.`]
      });

      stringDeserializeWithStrictTypeCheckingTest({
        value: "abc",
        expectedResult: "abc"
      });
    });

    describe("without strict type-checking", () => {
      function stringDeserializeWithoutStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: stringSpec,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      stringDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a string.`]
      });

      stringDeserializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a string.`]
      });

      stringDeserializeWithoutStrictTypeCheckingTest({
        value: "abc",
        expectedResult: "abc"
      });
    });
  });
});