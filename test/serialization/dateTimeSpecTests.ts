// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dateTimeSpec from "../../lib/serialization/dateTimeSpec";
import { serializeTest } from "./specTest";

describe("dateTimeSpec", () => {
  it("should have \"DateTime\" for its typeName property", () => {
    assert.strictEqual("DateTime", dateTimeSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dateTimeSerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: dateTimeSpec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error(`Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 DateTime format.`)
      });

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error(`Property a.property.path with value false must be an instanceof Date or a string in ISO8601 DateTime format.`)
      });

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error(`Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 DateTime format.`)
      });

      dateTimeSerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 DateTime format.`)
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
  });
});