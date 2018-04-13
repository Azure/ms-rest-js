// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dateSpec from "../../lib/serialization/dateSpec";
import { serializeTest } from "./specTest";

describe("dateSpec", () => {
  it("should have \"Date\" for its typeName property", () => {
    assert.strictEqual("Date", dateSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dateSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: dateSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      dateSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 Date format.")
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error("Property a.property.path with value false must be an instanceof Date or a string in ISO8601 Date format.")
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 Date format.")
      });

      dateSerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 Date format.`)
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
});