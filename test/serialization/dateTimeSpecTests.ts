// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dateTimeSpec from "../../lib/serialization/dateTimeSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("dateTimeSpec", () => {
  it("should have \"DateTime\" for its typeName property", () => {
    assert.strictEqual("DateTime", dateTimeSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dateTimeSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: dateTimeSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be an instanceof Date or a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error(`Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: "2011-10-05T14:48:00.000Z"
      });

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: new Date("2011-10-05T14:48:00.000Z"),
        expectedResult: "2011-10-05T14:48:00.000Z"
      });
    });

    describe("without strict type-checking", () => {
      function dateTimeSerializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: dateTimeSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateTimeSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      dateTimeSerializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      dateTimeSerializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      dateTimeSerializeWithoutStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: `hello world!`,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      dateTimeSerializeWithoutStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: "2011-10-05T14:48:00.000Z"
      });

      dateTimeSerializeWithoutStrictTypeCheckingTest({
        value: new Date("2011-10-05T14:48:00.000Z"),
        expectedResult: "2011-10-05T14:48:00.000Z"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function dateTimeDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Date | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: dateTimeSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateTimeDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a string in ISO8601 DateTime format.`]
      });

      dateTimeDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a string in ISO8601 DateTime format.`]
      });

      dateTimeDeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error(`Property a.property.path with value 5 must be a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be a string in ISO8601 DateTime format.`]
      });

      dateTimeDeserializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be a string in ISO8601 DateTime format.`]
      });

      dateTimeDeserializeWithStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: new Date("2011-10-05T14:48:00.000Z")
      });
    });

    describe("without strict type-checking", () => {
      function dateTimeDeserializeWithoutStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Date | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: dateTimeSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateTimeDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a string in ISO8601 DateTime format.`]
      });

      dateTimeDeserializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a string in ISO8601 DateTime format.`]
      });

      dateTimeDeserializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be a string in ISO8601 DateTime format.`]
      });

      dateTimeDeserializeWithoutStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: `hello world!` as any,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be a string in ISO8601 DateTime format.`]
      });

      dateTimeDeserializeWithoutStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: new Date("2011-10-05T14:48:00.000Z")
      });
    });
  });
});