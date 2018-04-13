// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import objectSpec, { ObjectType } from "../../lib/serialization/objectSpec";
import { serializeTest } from "./specTest";

describe("objectSpec", () => {
  it("should have \"object\" for its typeName property", () => {
    assert.strictEqual("object", objectSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function objectSerializeWithStrictTypeCheckingTest(args: { value: ObjectType, expectedResult: ObjectType | Error }): void {
        serializeTest({
          typeSpec: objectSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      objectSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error(`Property a.property.path with value undefined must be an object.`)
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error(`Property a.property.path with value false must be an object.`)
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: <any>[],
        expectedResult: new Error(`Property a.property.path with value [] must be an object.`)
      });

      objectSerializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });
    });
  });
});