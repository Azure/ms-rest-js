// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import stringSpec from "../../lib/serialization/stringSpec";
import { serializeTest } from "./specTest";

describe("stringSpec", () => {
  it("should have \"string\" for its typeName property", () => {
    assert.strictEqual("string", stringSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function stringSerializeWithStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: stringSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      stringSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error(`Property a.property.path with value undefined must be a string.`)
      });

      stringSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error(`Property a.property.path with value false must be a string.`)
      });

      stringSerializeWithStrictTypeCheckingTest({
        value: "abc",
        expectedResult: "abc"
      });
    });
  });
});