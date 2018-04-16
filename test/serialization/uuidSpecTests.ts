// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import uuidSpec from "../../lib/serialization/uuidSpec";
import { serializeTest } from "./specTest";

describe("uuidSpec", () => {
  it("should have \"UUID\" for its typeName property", () => {
    assert.strictEqual("UUID", uuidSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function uuidSerializeWithStrictTypeCheckingTest(args: { value: string, expectedResult: string | Error }): void {
        serializeTest({
          typeSpec: uuidSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      uuidSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error(`Property a.property.path with value undefined must be a UUID string.`)
      });

      uuidSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error(`Property a.property.path with value false must be a UUID string.`)
      });

      uuidSerializeWithStrictTypeCheckingTest({
        value: <any>[],
        expectedResult: new Error(`Property a.property.path with value [] must be a UUID string.`)
      });

      uuidSerializeWithStrictTypeCheckingTest({
        value: "abc",
        expectedResult: new Error(`Property a.property.path with value "abc" must be a UUID string.`)
      });

      uuidSerializeWithStrictTypeCheckingTest({
        value: "123e4567-e89b-12d3-a456-426655440000",
        expectedResult: "123e4567-e89b-12d3-a456-426655440000"
      });
    });
  });
});