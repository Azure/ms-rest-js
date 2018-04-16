// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import dictionarySpec, { DictionaryType } from "../../lib/serialization/dictionarySpec";
import numberSpec from "../../lib/serialization/numberSpec";
import { TypeSpec } from "../../lib/serialization/typeSpec";
import { serializeTest } from "./specTest";

describe("dictionarySpec", () => {
  it("should have \"Dictionary<T>\" for its specType property", () => {
    assert.strictEqual("Dictionary", dictionarySpec(numberSpec).specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function dictionarySerializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { valueSpec: TypeSpec<TSerialized, TDeserialized>, value: DictionaryType<TDeserialized>, expectedResult: DictionaryType<TSerialized> | Error }): void {
        serializeTest({
          typeSpec: dictionarySpec(args.valueSpec),
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be an object.")
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: <any>false,
        expectedResult: new Error("Property a.property.path with value false must be an object.")
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: <any>[],
        expectedResult: new Error("Property a.property.path with value [] must be an object.")
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: {},
        expectedResult: {}
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: <any>{ "9": "9" },
        expectedResult: new Error(`Property a.property.path.9 with value "9" must be a number.`)
      });

      dictionarySerializeWithStrictTypeCheckingTest({
        valueSpec: numberSpec,
        value: { "1": 1, "2": 2 },
        expectedResult: { "1": 1, "2": 2 }
      });
    });
  });
});