// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { enumSpec } from "../../lib/serialization/enumSpec";
import { serializeTest } from "./specTest";

describe("enumSpec", () => {
  it("should have \"Enum\" for its specType property", () => {
    assert.strictEqual("Enum", enumSpec("Letters", []).specType);
  });

  it("shoudl have the correct enumName property", () => {
    assert.strictEqual("Letters", enumSpec("Letters", []).enumName);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function enumSerializeWithStrictTypeCheckingTest<T>(args: { allowedValues: T[], value: T, expectedResult: T | Error }): void {
        serializeTest({
          typeSpec: enumSpec("Letters", args.allowedValues),
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      enumSerializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: <any>undefined,
        expectedResult: new Error(`Property a.property.path with value undefined must be one of the enum allowed values: ["a","b","c"].`)
      });

      enumSerializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "",
        expectedResult: new Error(`Property a.property.path with value "" must be one of the enum allowed values: ["a","b","c"].`)
      });

      enumSerializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "a",
        expectedResult: "a"
      });

      enumSerializeWithStrictTypeCheckingTest({
        allowedValues: ["a", "b", "c"],
        value: "A",
        expectedResult: "A"
      });
    });
  });
});