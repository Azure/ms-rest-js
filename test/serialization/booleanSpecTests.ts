// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import booleanSpec from "../../lib/serialization/booleanSpec";
import { deserializeTest, serializeTest } from "./specTest";

describe("booleanSpec", () => {
  it("should have \"boolean\" for its typeName property", () => {
    assert.strictEqual("boolean", booleanSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function booleanSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: boolean, expectedResult: boolean | Error }): void {
        serializeTest({
          typeSpec: booleanSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      booleanSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a boolean.")
      });

      booleanSerializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be a boolean.")
      });

      booleanSerializeWithStrictTypeCheckingTest({
        value: <any>"true",
        expectedResult: new Error(`Property a.property.path with value "true" must be a boolean.`)
      });

      booleanSerializeWithStrictTypeCheckingTest({
        value: <any>"false",
        expectedResult: new Error(`Property a.property.path with value "false" must be a boolean.`)
      });

      booleanSerializeWithStrictTypeCheckingTest({
        value: true,
        expectedResult: true
      });

      booleanSerializeWithStrictTypeCheckingTest({
        value: false,
        expectedResult: false
      });
    });

    describe("without strict type-checking", () => {
      function booleanSerializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: boolean, expectedResult: boolean | Error }): void {
        serializeTest({
          typeSpec: booleanSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: <any>undefined
      });

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: <any>5
      });

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: <any>"true",
        expectedResult: <any>"true"
      });

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: <any>"false",
        expectedResult: <any>"false"
      });

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: true,
        expectedResult: true
      });

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: false,
        expectedResult: false
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function booleanDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: boolean, expectedResult: boolean | Error }): void {
        deserializeTest({
          typeSpec: booleanSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      booleanDeserializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a boolean.")
      });

      booleanDeserializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be a boolean.")
      });

      booleanDeserializeWithStrictTypeCheckingTest({
        value: <any>"true",
        expectedResult: new Error(`Property a.property.path with value "true" must be a boolean.`)
      });

      booleanDeserializeWithStrictTypeCheckingTest({
        value: <any>"false",
        expectedResult: new Error(`Property a.property.path with value "false" must be a boolean.`)
      });

      booleanDeserializeWithStrictTypeCheckingTest({
        value: true,
        expectedResult: true
      });

      booleanDeserializeWithStrictTypeCheckingTest({
        value: false,
        expectedResult: false
      });
    });

    describe("without strict type-checking", () => {
      function booleanDeserializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: boolean, expectedResult: boolean | Error }): void {
        deserializeTest({
          typeSpec: booleanSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: <any>undefined
      });

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: <any>5
      });

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: <any>"true",
        expectedResult: <any>"true"
      });

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: <any>"false",
        expectedResult: <any>"false"
      });

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: true,
        expectedResult: true
      });

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: false,
        expectedResult: false
      });
    });
  });
});