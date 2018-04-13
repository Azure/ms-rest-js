// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import numberSpec from "../../lib/serialization/numberSpec";
import { serializeTest } from "./specTest";

describe("numberSpec", () => {
  it("should have \"number\" for its typeName property", () => {
    assert.strictEqual("number", numberSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function numberSerializeWithStrictTypeCheckingTest(args: { value: number, expectedResult: number | Error }): void {
        serializeTest({
          typeSpec: numberSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      numberSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a number.")
      });

      numberSerializeWithStrictTypeCheckingTest({
        value: <any>"",
        expectedResult: new Error(`Property a.property.path with value "" must be a number.`)
      });

      numberSerializeWithStrictTypeCheckingTest({
        value: 12,
        expectedResult: 12
      });
    });
  });
});