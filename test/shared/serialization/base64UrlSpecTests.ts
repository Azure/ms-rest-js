// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import base64UrlSpec from "../../../lib/serialization/base64UrlSpec";
import { deserializeTest, serializeTest } from "./specTest";

function createUint8Array(value: number[]): Uint8Array {
  if (typeof Buffer === "undefined") {
    return Uint8Array.from(value);
  } else {
    return Buffer.from(value);
  }
}

describe("base64UrlSpec", () => {
  it("should have \"Base64Url\" for its typeName property", () => {
    assert.strictEqual("Base64Url", base64UrlSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function base64UrlSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Uint8Array, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: base64UrlSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      base64UrlSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a Uint8Array."),
        expectedLogs: ["ERROR: Property a.property.path with value undefined must be a Uint8Array."]
      });

      base64UrlSerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a Uint8Array."),
        expectedLogs: ["ERROR: Property a.property.path with value 5 must be a Uint8Array."]
      });

      base64UrlSerializeWithStrictTypeCheckingTest({
        value: {} as any,
        expectedResult: new Error("Property a.property.path with value {} must be a Uint8Array."),
        expectedLogs: ["ERROR: Property a.property.path with value {} must be a Uint8Array."]
      });

      base64UrlSerializeWithStrictTypeCheckingTest({
        value: createUint8Array([0, 1, 2, 3, 4]),
        expectedResult: "AAECAwQ"
      });
    });

    describe("without strict type-checking", () => {
      function base64UrlSerializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: Uint8Array, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: base64UrlSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      base64UrlSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: ["WARNING: Property a.property.path with value undefined should be a Uint8Array."]
      });

      base64UrlSerializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: ["WARNING: Property a.property.path with value 5 should be a Uint8Array."]
      });

      base64UrlSerializeWithoutStrictTypeCheckingTest({
        value: {} as any,
        expectedResult: {} as any,
        expectedLogs: ["WARNING: Property a.property.path with value {} should be a Uint8Array."]
      });

      base64UrlSerializeWithoutStrictTypeCheckingTest({
        value: createUint8Array([0, 1, 2, 3, 4]),
        expectedResult: "AAECAwQ"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function base64UrlDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Uint8Array | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: base64UrlSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      base64UrlDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a string."),
        expectedLogs: ["ERROR: Property a.property.path with value undefined must be a string."]
      });

      base64UrlDeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a string."),
        expectedLogs: ["ERROR: Property a.property.path with value 5 must be a string."]
      });

      base64UrlDeserializeWithStrictTypeCheckingTest({
        value: {} as any,
        expectedResult: new Error("Property a.property.path with value {} must be a string."),
        expectedLogs: ["ERROR: Property a.property.path with value {} must be a string."]
      });

      base64UrlDeserializeWithStrictTypeCheckingTest({
        value: "AAECAwQ",
        expectedResult: createUint8Array([0, 1, 2, 3, 4])
      });
    });

    describe("without strict type-checking", () => {
      function base64UrlDeserializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Uint8Array | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: base64UrlSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      base64UrlDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: ["WARNING: Property a.property.path with value undefined should be a string."]
      });

      base64UrlDeserializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: ["WARNING: Property a.property.path with value 5 should be a string."]
      });

      base64UrlDeserializeWithoutStrictTypeCheckingTest({
        value: {} as any,
        expectedResult: {} as any,
        expectedLogs: ["WARNING: Property a.property.path with value {} should be a string."]
      });

      base64UrlDeserializeWithoutStrictTypeCheckingTest({
        value: "AAECAwQ",
        expectedResult: createUint8Array([0, 1, 2, 3, 4])
      });
    });
  });
});
