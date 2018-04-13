// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import byteArraySpec from "../../lib/serialization/byteArraySpec";
import { deserializeTest, serializeTest } from "./specTest";

describe("byteArraySpec", () => {
  it("should have \"ByteArray\" for its typeName property", () => {
    assert.strictEqual("ByteArray", byteArraySpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function byteArraySerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Buffer, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: byteArraySpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      byteArraySerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a Buffer.")
      });

      byteArraySerializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be a Buffer.")
      });

      byteArraySerializeWithStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: new Error("Property a.property.path with value {} must be a Buffer.")
      });

      byteArraySerializeWithStrictTypeCheckingTest({
        value: new Buffer([0, 1, 2, 3, 4]),
        expectedResult: "AAECAwQ="
      });
    });

    describe("without strict type-checking", () => {
      function byteArraySerializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: Buffer, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: byteArraySpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      byteArraySerializeWithoutStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: <any>undefined
      });

      byteArraySerializeWithoutStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: <any>5
      });

      byteArraySerializeWithoutStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: <any>{}
      });

      byteArraySerializeWithoutStrictTypeCheckingTest({
        value: new Buffer([0, 1, 2, 3, 4]),
        expectedResult: "AAECAwQ="
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function byteArrayDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Buffer | Error }): void {
        deserializeTest({
          typeSpec: byteArraySpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      byteArrayDeserializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a string.")
      });

      byteArrayDeserializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be a string.")
      });

      byteArrayDeserializeWithStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: new Error("Property a.property.path with value {} must be a string.")
      });

      byteArrayDeserializeWithStrictTypeCheckingTest({
        value: "AAECAwQ=",
        expectedResult: new Buffer([0, 1, 2, 3, 4])
      });
    });

    describe("without strict type-checking", () => {
      function byteArrayDeserializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Buffer | Error }): void {
        deserializeTest({
          typeSpec: byteArraySpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      byteArrayDeserializeWithoutStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: <any>undefined
      });

      byteArrayDeserializeWithoutStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: <any>5
      });

      byteArrayDeserializeWithoutStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: <any>{}
      });

      byteArrayDeserializeWithoutStrictTypeCheckingTest({
        value: "AAECAwQ=",
        expectedResult: new Buffer([0, 1, 2, 3, 4])
      });
    });
  });
});