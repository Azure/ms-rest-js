// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import * as moment from "moment";
import timeSpanSpec from "../../lib/serialization/timeSpanSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("timeSpanSpec", () => {
  it("should have \"TimeSpan\" for its typeName property", () => {
    assert.strictEqual("TimeSpan", timeSpanSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function timeSpanSerializeWithStrictTypeCheckingTest(args: { value: moment.Duration, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: timeSpanSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be a TimeSpan/Duration."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be a TimeSpan/Duration."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be a TimeSpan/Duration."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be a TimeSpan/Duration.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: "P123DT22H14M12.011S" as any,
        expectedResult: new Error(`Property a.property.path with value "P123DT22H14M12.011S" must be a TimeSpan/Duration.`),
        expectedLogs: [`ERROR: Property a.property.path with value "P123DT22H14M12.011S" must be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 }),
        expectedResult: "P123DT22H14M12.011S"
      });
    });

    describe("without strict type-checking", () => {
      function timeSpanSerializeWithoutStrictTypeCheckingTest(args: { value: moment.Duration, expectedResult: string | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: timeSpanSpec,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      timeSpanSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithoutStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: `hello world!` as any,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithoutStrictTypeCheckingTest({
        value: "P123DT22H14M12.011S" as any,
        expectedResult: "P123DT22H14M12.011S" as any,
        expectedLogs: [`WARNING: Property a.property.path with value "P123DT22H14M12.011S" should be a TimeSpan/Duration.`]
      });

      timeSpanSerializeWithoutStrictTypeCheckingTest({
        value: moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 }),
        expectedResult: "P123DT22H14M12.011S"
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function timeSpanDeserializeWithStrictTypeCheckingTest(args: { value: string, expectedResult: moment.Duration | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: timeSpanSpec,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      timeSpanDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an ISO8601 TimeSpan/Duration string."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an ISO8601 TimeSpan/Duration string."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: new Error("Property a.property.path with value 5 must be an ISO8601 TimeSpan/Duration string."),
        expectedLogs: [`ERROR: Property a.property.path with value 5 must be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an ISO8601 TimeSpan/Duration string.`),
        expectedLogs: [`ERROR: Property a.property.path with value "hello world!" must be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithStrictTypeCheckingTest({
        value: moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 }) as any,
        expectedResult: new Error(`Property a.property.path with value "P123DT22H14M12.011S" must be an ISO8601 TimeSpan/Duration string.`),
        expectedLogs: [`ERROR: Property a.property.path with value "P123DT22H14M12.011S" must be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithStrictTypeCheckingTest({
        value: "P123DT22H14M12.011S",
        expectedResult: moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 })
      });
    });

    describe("without strict type-checking", () => {
      function timeSpanDeserializeWithoutStrictTypeCheckingTest(args: { value: string, expectedResult: moment.Duration | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: timeSpanSpec,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      timeSpanDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithoutStrictTypeCheckingTest({
        value: 5 as any,
        expectedResult: 5 as any,
        expectedLogs: [`WARNING: Property a.property.path with value 5 should be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithoutStrictTypeCheckingTest({
        value: "hello world!" as any,
        expectedResult: `hello world!` as any,
        expectedLogs: [`WARNING: Property a.property.path with value "hello world!" should be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithoutStrictTypeCheckingTest({
        value: moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 }) as any,
        expectedResult: moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 }) as any,
        expectedLogs: [`WARNING: Property a.property.path with value "P123DT22H14M12.011S" should be an ISO8601 TimeSpan/Duration string.`]
      });

      timeSpanDeserializeWithoutStrictTypeCheckingTest({
        value: "P123DT22H14M12.011S",
        expectedResult: moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 })
      });
    });
  });
});