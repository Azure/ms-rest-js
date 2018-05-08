// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import byteArraySpec from "../../../lib/serialization/byteArraySpec";
import { deserializeTest, serializeTest } from "./specTest";

function createUint8Array(value: number[]): Uint8Array {
  if (typeof Buffer === "undefined") {
    return Uint8Array.from(value);
  } else {
    return Buffer.from(value);
  }
}

describe("byteArraySpec", () => {
  it("should have \"ByteArray\" for its typeName property", () => {
    assert.strictEqual("ByteArray", byteArraySpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function byteArraySerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Uint8Array, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: byteArraySpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      byteArraySerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a Uint8Array."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a Uint8Array.`]
      });

      byteArraySerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a Uint8Array."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be a Uint8Array.`]
      });

      byteArraySerializeWithStrictTypeCheckingTest({
        value: {} as any,
        expectedResult: new Error("Property a.property.path with value {} must be a Uint8Array."),
        expectedLogs: [`ERROR: Property a.property.path with value {} must be a Uint8Array.`]
      });

      byteArraySerializeWithStrictTypeCheckingTest({
        value: createUint8Array([0, 1, 2, 3, 4]),
        expectedResult: "AAECAwQ="
      });
    });

    describe("without strict type-checking", () => {
      function byteArraySerializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: Uint8Array, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: byteArraySpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      byteArraySerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a Uint8Array.`]
      });

      byteArraySerializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be a Uint8Array.`]
      });

      byteArraySerializeWithoutStrictTypeCheckingTest({
        value: {} as any,
        expectedResult: {} as any,
        expectedLogs: [`WARNING: Property a.property.path with value {} should be a Uint8Array.`]
      });

      byteArraySerializeWithoutStrictTypeCheckingTest({
        value: createUint8Array([0, 1, 2, 3, 4]),
        expectedResult: "AAECAwQ="
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function byteArrayDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Uint8Array | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: byteArraySpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      byteArrayDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a string."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a string.`]
      });

      byteArrayDeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a string."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be a string.`]
      });

      byteArrayDeserializeWithStrictTypeCheckingTest({
        value: {} as any,
        expectedResult: new Error("Property a.property.path with value {} must be a string."),
        expectedLogs: [`ERROR: Property a.property.path with value {} must be a string.`]
      });

      byteArrayDeserializeWithStrictTypeCheckingTest({
        value: "AAECAwQ=",
        expectedResult: createUint8Array([0, 1, 2, 3, 4])
      });
    });

    describe("without strict type-checking", () => {
      function byteArrayDeserializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Uint8Array | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: byteArraySpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      byteArrayDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a string.`]
      });

      byteArrayDeserializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be a string.`]
      });

      byteArrayDeserializeWithoutStrictTypeCheckingTest({
        value: {} as any,
        expectedResult: {} as any,
        expectedLogs: [`WARNING: Property a.property.path with value {} should be a string.`]
      });

      byteArrayDeserializeWithoutStrictTypeCheckingTest({
        value: "AAECAwQ=",
        expectedResult: createUint8Array([0, 1, 2, 3, 4])
      });
    });
  });
});
