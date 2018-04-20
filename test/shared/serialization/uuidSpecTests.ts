// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import uuidSpec from "../../../lib/serialization/uuidSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("uuidSpec", () => {
  it("should have \"UUID\" for its typeName property", () => {
    assert.strictEqual("UUID", uuidSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function uuidSerializeWithStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: uuidSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      uuidSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be a UUID string.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a UUID string.`]
      });

      uuidSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be a UUID string.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a UUID string.`]
      });

      uuidSerializeWithStrictTypeCheckingTest({
        value: [] as any,
        expectedResult: new Error(`Property a.property.path with value [] must be a UUID string.`),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be a UUID string.`]
      });

      uuidSerializeWithStrictTypeCheckingTest({
        value: "abc",
        expectedResult: new Error(`Property a.property.path with value "abc" must be a UUID string.`),
        expectedLogs: [`ERROR: Property a.property.path with value "abc" must be a UUID string.`]
      });

      uuidSerializeWithStrictTypeCheckingTest({
        value: "123e4567-e89b-12d3-a456-426655440000",
        expectedResult: "123e4567-e89b-12d3-a456-426655440000"
      });
    });

    describe("without strict type-checking", () => {
      function uuidSerializeWithoutStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: uuidSpec,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      uuidSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a UUID string.`]
      });

      uuidSerializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a UUID string.`]
      });

      uuidSerializeWithoutStrictTypeCheckingTest({
        value: [] as any,
        expectedResult: [] as any,
        expectedLogs: [`WARNING: Property a.property.path with value [] should be a UUID string.`]
      });

      uuidSerializeWithoutStrictTypeCheckingTest({
        value: "abc",
        expectedResult: "abc",
        expectedLogs: [`WARNING: Property a.property.path with value "abc" should be a UUID string.`]
      });

      uuidSerializeWithoutStrictTypeCheckingTest({
        value: "123e4567-e89b-12d3-a456-426655440000",
        expectedResult: "123e4567-e89b-12d3-a456-426655440000"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function uuidDeserializeWithStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: uuidSpec,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      uuidDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be a UUID string.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a UUID string.`]
      });

      uuidDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be a UUID string.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a UUID string.`]
      });

      uuidDeserializeWithStrictTypeCheckingTest({
        value: [] as any,
        expectedResult: new Error(`Property a.property.path with value [] must be a UUID string.`),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be a UUID string.`]
      });

      uuidDeserializeWithStrictTypeCheckingTest({
        value: "abc",
        expectedResult: new Error(`Property a.property.path with value "abc" must be a UUID string.`),
        expectedLogs: [`ERROR: Property a.property.path with value "abc" must be a UUID string.`]
      });

      uuidDeserializeWithStrictTypeCheckingTest({
        value: "123e4567-e89b-12d3-a456-426655440000",
        expectedResult: "123e4567-e89b-12d3-a456-426655440000"
      });
    });

    describe("without strict type-checking", () => {
      function uuidDeserializeWithoutStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: uuidSpec,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      uuidDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a UUID string.`]
      });

      uuidDeserializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a UUID string.`]
      });

      uuidDeserializeWithoutStrictTypeCheckingTest({
        value: [] as any,
        expectedResult: [] as any,
        expectedLogs: [`WARNING: Property a.property.path with value [] should be a UUID string.`]
      });

      uuidDeserializeWithoutStrictTypeCheckingTest({
        value: "abc",
        expectedResult: "abc",
        expectedLogs: [`WARNING: Property a.property.path with value "abc" should be a UUID string.`]
      });

      uuidDeserializeWithoutStrictTypeCheckingTest({
        value: "123e4567-e89b-12d3-a456-426655440000",
        expectedResult: "123e4567-e89b-12d3-a456-426655440000"
      });
    });
  });
});