// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dateTimeRfc1123Spec from "../../../lib/serialization/dateTimeRfc1123Spec";
import { serializeTest, deserializeTest } from "./specTest";

describe("dateTimeRfc1123Spec", () => {
  it("should have \"DateTimeRFC1123\" for its typeName property", () => {
    assert.strictEqual("DateTimeRFC1123", dateTimeRfc1123Spec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dateTimeRfc1123SerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: dateTimeRfc1123Spec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an instanceof Date or a string in RFC1123 DateTime format."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an instanceof Date or a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an instanceof Date or a string in RFC1123 DateTime format."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an instanceof Date or a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be an instanceof Date or a string in RFC1123 DateTime format."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be an instanceof Date or a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an instanceof Date or a string in RFC1123 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be an instanceof Date or a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: "Wed, 05 Oct 2011 14:48:00 GMT"
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: new Date("2011-10-05T14:48:00.000Z"),
        expectedResult: "Wed, 05 Oct 2011 14:48:00 GMT"
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: "Wed, 05 Oct 2011 14:48:00 GMT",
        expectedResult: "Wed, 05 Oct 2011 14:48:00 GMT"
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: new Date("Wed, 05 Oct 2011 14:48:00 GMT"),
        expectedResult: "Wed, 05 Oct 2011 14:48:00 GMT"
      });
    });

    describe("without strict type-checking", () => {
      function dateTimeRfc1123SerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: dateTimeRfc1123Spec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an instanceof Date or a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an instanceof Date or a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be an instanceof Date or a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: "hello world!",
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be an instanceof Date or a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: "2011-10-05T14:48:00.000Z",
        expectedResult: "Wed, 05 Oct 2011 14:48:00 GMT"
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: new Date("2011-10-05T14:48:00.000Z"),
        expectedResult: "Wed, 05 Oct 2011 14:48:00 GMT"
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: "Wed, 05 Oct 2011 14:48:00 GMT",
        expectedResult: "Wed, 05 Oct 2011 14:48:00 GMT"
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: new Date("Wed, 05 Oct 2011 14:48:00 GMT"),
        expectedResult: "Wed, 05 Oct 2011 14:48:00 GMT"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function dateTimeRfc1123DeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Date | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: dateTimeRfc1123Spec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a string in RFC1123 DateTime format."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be a string in RFC1123 DateTime format."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a string in RFC1123 DateTime format."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be a string in RFC1123 DateTime format.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: "Wed, 05 Oct 2011 14:48:00 GMT",
        expectedResult: new Date("2011-10-05T14:48:00.000Z")
      });
    });

    describe("without strict type-checking", () => {
      function dateTimeRfc1123DeserializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: string, expectedResult: Date | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: dateTimeRfc1123Spec,
          propertyPath: args.propertyPath,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: "hello world!" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be a string in RFC1123 DateTime format.`]
      });

      dateTimeRfc1123DeserializeWithStrictTypeCheckingTest({
        value: "Wed, 05 Oct 2011 14:48:00 GMT",
        expectedResult: new Date("2011-10-05T14:48:00.000Z")
      });
    });
  });
});