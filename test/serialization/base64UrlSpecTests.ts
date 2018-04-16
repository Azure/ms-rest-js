// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import base64UrlSpec from "../../lib/serialization/base64UrlSpec";
import { deserializeTest, serializeTest } from "./specTest";

describe("base64UrlSpec", () => {
  it("should have \"Base64Url\" for its typeName property", () => {
    assert.strictEqual("Base64Url", base64UrlSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function base64UrlSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Buffer, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: base64UrlSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      base64UrlSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a Buffer.")
      });

      base64UrlSerializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be a Buffer.")
      });

      base64UrlSerializeWithStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: new Error("Property a.property.path with value {} must be a Buffer.")
      });

      base64UrlSerializeWithStrictTypeCheckingTest({
        value: new Buffer([0, 1, 2, 3, 4]),
        expectedResult: "AAECAwQ"
      });
    });

    describe("without strict type-checking", () => {
      function base64UrlSerializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: Buffer, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: base64UrlSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      base64UrlSerializeWithoutStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: <any>undefined
      });

      base64UrlSerializeWithoutStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: <any>5
      });

      base64UrlSerializeWithoutStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: <any>{}
      });

      base64UrlSerializeWithoutStrictTypeCheckingTest({
        value: new Buffer([0, 1, 2, 3, 4]),
        expectedResult: "AAECAwQ"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function base64UrlDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Buffer | Error }): void {
        deserializeTest({
          typeSpec: base64UrlSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      base64UrlDeserializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a string.")
      });

      base64UrlDeserializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be a string.")
      });

      base64UrlDeserializeWithStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: new Error("Property a.property.path with value {} must be a string.")
      });

      base64UrlDeserializeWithStrictTypeCheckingTest({
        value: "AAECAwQ",
        expectedResult: new Buffer([0, 1, 2, 3, 4])
      });
    });

    describe("without strict type-checking", () => {
      function base64UrlDeserializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Buffer | Error }): void {
        deserializeTest({
          typeSpec: base64UrlSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      base64UrlDeserializeWithoutStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: <any>undefined
      });

      base64UrlDeserializeWithoutStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: <any>5
      });

      base64UrlDeserializeWithoutStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: <any>{}
      });

      base64UrlDeserializeWithoutStrictTypeCheckingTest({
        value: "AAECAwQ",
        expectedResult: new Buffer([0, 1, 2, 3, 4])
      });
    });
  });
});