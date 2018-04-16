// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dateTimeRfc1123Spec from "../../lib/serialization/dateTimeRfc1123Spec";
import { serializeTest } from "./specTest";

describe("dateTimeRfc1123Spec", () => {
  it("should have \"DateTimeRFC1123\" for its typeName property", () => {
    assert.strictEqual("DateTimeRFC1123", dateTimeRfc1123Spec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dateTimeRfc1123SerializeWithStrictTypeCheckingTest(args: { propertyPath?: string[], value: Date | string, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: dateTimeRfc1123Spec,
          propertyPath: args.propertyPath,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be an instanceof Date or a string in RFC1123 DateTime format.")
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error("Property a.property.path with value false must be an instanceof Date or a string in RFC1123 DateTime format.")
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: <any>5,
        expectedResult: new Error("Property a.property.path with value 5 must be an instanceof Date or a string in RFC1123 DateTime format.")
      });

      dateTimeRfc1123SerializeWithStrictTypeCheckingTest({
        value: "hello world!",
        expectedResult: new Error(`Property a.property.path with value "hello world!" must be an instanceof Date or a string in RFC1123 DateTime format.`)
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
});