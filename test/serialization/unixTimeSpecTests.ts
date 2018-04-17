// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import unixTimeSpec from "../../lib/serialization/unixTimeSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("unixTimeSpec", () => {
  it("should have \"UnixTime\" for its typeName property", () => {
    assert.strictEqual("UnixTime", unixTimeSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function unixTimeSerializeWithStrictTypeCheckingTest(args: { value: Date | string, expectedResult: number | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: unixTimeSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be an instanceof Date or a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error(`Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: 1317826080
      });

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: new Date("2011-10-05T14:48:00.000Z"),
        expectedResult: 1317826080
      });
    });

    describe("with strict type-checking", () => {
      function unixTimeSerializeWithoutStrictTypeCheckingTest(args: { value: Date | string, expectedResult: number | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: unixTimeSpec,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      unixTimeSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      unixTimeSerializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      unixTimeSerializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      unixTimeSerializeWithoutStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: "hello world!" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be an instanceof Date or a string in ISO8601 DateTime format.`]
      });

      unixTimeSerializeWithoutStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: 1317826080
      });

      unixTimeSerializeWithoutStrictTypeCheckingTest({
        value: new Date("2011-10-05T14:48:00.000Z"),
        expectedResult: 1317826080
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function unixTimeDeserializeWithStrictTypeCheckingTest(args: { value: number, expectedResult: Date | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: unixTimeSpec,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      unixTimeDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error(`Property a.property.path with value undefined must be a unix time number.`),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a unix time number.`]
      });

      unixTimeDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error(`Property a.property.path with value false must be a unix time number.`),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a unix time number.`]
      });

      unixTimeDeserializeWithStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be a unix time number.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be a unix time number.`]
      });

      unixTimeDeserializeWithStrictTypeCheckingTest({
        value: 1317826080,
        expectedResult: new Date("2011-10-05T14:48:00.000Z")
      });
    });

    describe("with strict type-checking", () => {
      function unixTimeDeserializeWithoutStrictTypeCheckingTest(args: { value: number, expectedResult: Date | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: unixTimeSpec,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      unixTimeDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a unix time number.`]
      });

      unixTimeDeserializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a unix time number.`]
      });

      unixTimeDeserializeWithoutStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: "hello world!" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be a unix time number.`]
      });

      unixTimeDeserializeWithoutStrictTypeCheckingTest({
        value: 1317826080,
        expectedResult: new Date("2011-10-05T14:48:00.000Z")
      });
    });
  });
});