// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import * as moment from "moment";
import timeSpanSpec from "../../lib/serialization/timeSpanSpec";
import { serializeTest } from "./specTest";

describe("timeSpanSpec", () => {
  it("should have \"TimeSpan\" for its typeName property", () => {
    assert.strictEqual("TimeSpan", timeSpanSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function timeSpanSerializeWithStrictTypeCheckingTest(args: { value: moment.Duration, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: timeSpanSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a TimeSpan/Duration.")
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error("Property a.property.path with value false must be a TimeSpan/Duration.")
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be a TimeSpan/Duration.")
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: <any>"hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be a TimeSpan/Duration.`)
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: <any>"P123DT22H14M12.011S",
        expectedResult: new Error(`Property a.property.path with value "P123DT22H14M12.011S" must be a TimeSpan/Duration.`)
      });

      timeSpanSerializeWithStrictTypeCheckingTest({
        value: moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 }),
        expectedResult: "P123DT22H14M12.011S"
      });
    });
  });
});