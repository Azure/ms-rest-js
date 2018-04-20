// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dateSpec from "../../../lib/serialization/dateSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("dateSpec", () => {
  it("should have \"Date\" for its typeName property", () => {
    assert.strictEqual("Date", dateSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dateSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: dateSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 Date format."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 Date format.`]
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an instanceof Date or a string in ISO8601 Date format."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an instanceof Date or a string in ISO8601 Date format.`]
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 Date format."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 Date format.`]
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 Date format.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 Date format.`]
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: "2011-10-05"
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: new Date("2011-10-06T14:48:00.000Z"),
        expectedResult: "2011-10-06"
      });
    });

    describe("without strict type-checking", () => {
      function dateSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: dateSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an instanceof Date or a string in ISO8601 Date format.`]
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an instanceof Date or a string in ISO8601 Date format.`]
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be an instanceof Date or a string in ISO8601 Date format.`]
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: "hello world!" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be an instanceof Date or a string in ISO8601 Date format.`]
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: "2011-10-05"
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: new Date("2011-10-06T14:48:00.000Z"),
        expectedResult: "2011-10-06"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function dateDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string | string, expectedResult: Date | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: dateSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a string in ISO8601 Date format."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a string in ISO8601 Date format.`]
      });

      dateDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be a string in ISO8601 Date format."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a string in ISO8601 Date format.`]
      });

      dateDeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a string in ISO8601 Date format."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be a string in ISO8601 Date format.`]
      });

      dateDeserializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be a string in ISO8601 Date format.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be a string in ISO8601 Date format.`]
      });

      dateDeserializeWithStrictTypeCheckingTest({
        value: "2011-10-05",
        expectedResult: new Date("2011-10-05")
      });
    });

    describe("without strict type-checking", () => {
      function dateDeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string | string, expectedResult: Date | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: dateSpec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a string in ISO8601 Date format.`]
      });

      dateDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a string in ISO8601 Date format.`]
      });

      dateDeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be a string in ISO8601 Date format.`]
      });

      dateDeserializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: "hello world!" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be a string in ISO8601 Date format.`]
      });

      dateDeserializeWithStrictTypeCheckingTest({
        value: "2011-10-05",
        expectedResult: new Date("2011-10-05")
      });
    });
  });
});