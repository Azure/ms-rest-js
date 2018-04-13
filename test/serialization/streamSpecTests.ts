// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import streamSpec from "../../lib/serialization/streamSpec";
import { serializeTest } from "./specTest";

describe("objectSpec", () => {
  it("should have \"Stream\" for its typeName property", () => {
    assert.strictEqual("Stream", streamSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function streamSerializeWithStrictTypeCheckingTest(args: { value: any, expectedResult: any | Error }): void {
        serializeTest({
          typeSpec: streamSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      streamSerializeWithStrictTypeCheckingTest({
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a Stream.")
      });

      streamSerializeWithStrictTypeCheckingTest({
        value: <any>false,
        expectedResult: new Error("Property a.property.path with value false must be a Stream.")
      });

      streamSerializeWithStrictTypeCheckingTest({
        value: <any>{},
        expectedResult: new Error("Property a.property.path with value {} must be a Stream.")
      });

      streamSerializeWithStrictTypeCheckingTest({
        value: <any>[],
        expectedResult: new Error("Property a.property.path with value [] must be a Stream.")
      });
    });
  });
});