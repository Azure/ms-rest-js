// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import objectSpec, { ObjectType } from "../../../lib/serialization/objectSpec";
import { deserializeTest, serializeTest } from "./specTest";

describe("objectSpec", () => {
  it("should have \"object\" for its typeName property", () => {
    assert.strictEqual("object", objectSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function objectSerializeWithStrictTypeCheckingTest(args: { value: ObjectType, expectedResult: ObjectType | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: objectSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      objectSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be an object.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an object.`]
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be an object.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an object.`]
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: [],
        expectedResult: new Error(`Property a.property.path with value [] must be an object.`),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be an object.`]
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });
    });

    describe("without strict type-checking", () => {
      function objectSerializeWithStrictTypeCheckingTest(args: { value: ObjectType, expectedResult: ObjectType | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: objectSpec,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      objectSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an object.`]
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an object.`]
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: [],
        expectedResult: [],
        expectedLogs: [`WARNING: Property a.property.path with value [] should be an object.`]
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function objectDeserializeWithStrictTypeCheckingTest(args: { value: ObjectType, expectedResult: ObjectType | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: objectSpec,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      objectDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be an object.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an object.`]
      });

      objectDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be an object.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an object.`]
      });

      objectDeserializeWithStrictTypeCheckingTest({
        value: [],
        expectedResult: new Error(`Property a.property.path with value [] must be an object.`),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be an object.`]
      });

      objectDeserializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });
    });

    describe("without strict type-checking", () => {
      function objectDeserializeWithStrictTypeCheckingTest(args: { value: ObjectType, expectedResult: ObjectType | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: objectSpec,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      objectDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an object.`]
      });

      objectDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an object.`]
      });

      objectDeserializeWithStrictTypeCheckingTest({
        value: [],
        expectedResult: [],
        expectedLogs: [`WARNING: Property a.property.path with value [] should be an object.`]
      });

      objectDeserializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });
    });
  });
});