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
      function booleanSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: boolean, expectedResult: boolean | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: booleanSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      booleanSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a boolean."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a boolean.`]
      });

      booleanSerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a boolean."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be a boolean.`]
      });

      booleanSerializeWithStrictTypeCheckingTest({
        value: "true" as any,
        expectedResult: new Error(`Property a.property.path with value "true" must be a boolean.`),
        expectedLogs: [`ERROR: Property a.property.path with value "true" must be a boolean.`]
      });

      booleanSerializeWithStrictTypeCheckingTest({
        value: "false" as any,
        expectedResult: new Error(`Property a.property.path with value "false" must be a boolean.`),
        expectedLogs: [`ERROR: Property a.property.path with value "false" must be a boolean.`]
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
      function booleanSerializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: boolean, expectedResult: boolean | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: booleanSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a boolean.`]
      });

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be a boolean.`]
      });

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: "true" as any,
        expectedResult: "true" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "true" should be a boolean.`]
      });

      booleanSerializeWithoutStrictTypeCheckingTest({
        value: "false" as any,
        expectedResult: "false" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "false" should be a boolean.`]
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
      function booleanDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: boolean, expectedResult: boolean | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: booleanSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      booleanDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a boolean."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a boolean.`]
      });

      booleanDeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a boolean."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be a boolean.`]
      });

      booleanDeserializeWithStrictTypeCheckingTest({
        value: "true" as any,
        expectedResult: new Error(`Property a.property.path with value "true" must be a boolean.`),
        expectedLogs: [`ERROR: Property a.property.path with value "true" must be a boolean.`]
      });

      booleanDeserializeWithStrictTypeCheckingTest({
        value: "false" as any,
        expectedResult: new Error(`Property a.property.path with value "false" must be a boolean.`),
        expectedLogs: [`ERROR: Property a.property.path with value "false" must be a boolean.`]
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
      function booleanDeserializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: boolean, expectedResult: boolean | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: booleanSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a boolean.`]
      });

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be a boolean.`]
      });

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: "true" as any,
        expectedResult: "true" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "true" should be a boolean.`]
      });

      booleanDeserializeWithoutStrictTypeCheckingTest({
        value: "false" as any,
        expectedResult: "false" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "false" should be a boolean.`]
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