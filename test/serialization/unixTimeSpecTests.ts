// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import unixTimeSpec from "../../lib/serialization/unixTimeSpec";
import { serializeTest } from "./specTest";

describe("unixTimeSpec", () => {
  it("should have \"UnixTime\" for its typeName property", () => {
    assert.strictEqual("UnixTime", unixTimeSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function unixTimeSerializeWithStrictTypeCheckingTest(args: { value: Date | string, expectedResult: number | Error }): void {
        serializeTest({
          typeSpec: unixTimeSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error(`Property a.property.path with value undefined must be an instanceof Date or a string in ISO8601 format.`)
      });

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error(`Property a.property.path with value false must be an instanceof Date or a string in ISO8601 format.`)
      });

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error(`Property a.property.path with value 5 must be an instanceof Date or a string in ISO8601 format.`)
      });

      unixTimeSerializeWithStrictTypeCheckingTest({
        value: <any>"hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an instanceof Date or a string in ISO8601 format.`)
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
  });
});