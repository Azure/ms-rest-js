// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import numberSpec from "../../lib/serialization/numberSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("numberSpec", () => {
  it("should have \"number\" for its typeName property", () => {
    assert.strictEqual("number", numberSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function numberSerializeWithStrictTypeCheckingTest(args: { value: number, expectedResult: number | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: numberSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      numberSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a number."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a number.`]
      });

      numberSerializeWithStrictTypeCheckingTest({
        value: "" as any,
        expectedResult: new Error(`Property a.property.path with value "" must be a number.`),
        expectedLogs: [`ERROR: Property a.property.path with value "" must be a number.`]
      });

      numberSerializeWithStrictTypeCheckingTest({
        value: 12,
        expectedResult: 12
      });
    });

    describe("without strict type-checking", () => {
      function numberSerializeWithoutStrictTypeCheckingTest(args: { value: number, expectedResult: number | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: numberSpec,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      numberSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a number.`]
      });

      numberSerializeWithoutStrictTypeCheckingTest({
        value: "" as any,
        expectedResult: "" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "" should be a number.`]
      });

      numberSerializeWithoutStrictTypeCheckingTest({
        value: 12,
        expectedResult: 12
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function numberDeserializeWithStrictTypeCheckingTest(args: { value: number, expectedResult: number | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: numberSpec,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      numberDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a number."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a number.`]
      });

      numberDeserializeWithStrictTypeCheckingTest({
        value: "" as any,
        expectedResult: new Error(`Property a.property.path with value "" must be a number.`),
        expectedLogs: [`ERROR: Property a.property.path with value "" must be a number.`]
      });

      numberDeserializeWithStrictTypeCheckingTest({
        value: 12,
        expectedResult: 12
      });
    });

    describe("without strict type-checking", () => {
      function numberDeserializeWithoutStrictTypeCheckingTest(args: { value: number, expectedResult: number | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: numberSpec,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      numberDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a number.`]
      });

      numberDeserializeWithoutStrictTypeCheckingTest({
        value: "" as any,
        expectedResult: "" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "" should be a number.`]
      });

      numberDeserializeWithoutStrictTypeCheckingTest({
        value: 12,
        expectedResult: 12
      });
    });
  });
});