// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import sequenceSpec from "../../lib/serialization/sequenceSpec";
import stringSpec from "../../lib/serialization/stringSpec";
import { TypeSpec } from "../../lib/serialization/typeSpec";
import { serializeTest } from "./specTest";

describe("sequenceSpec", () => {
  it("should have \"Sequence\" for its specType property", () => {
    assert.strictEqual("Sequence", sequenceSpec(stringSpec).specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function sequenceSerializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { elementSpec: TypeSpec<TSerialized, TDeserialized>, value: TDeserialized[], expectedResult: TSerialized[] | Error }): void {
        serializeTest({
          typeSpec: sequenceSpec(args.elementSpec),
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult
        });
      }

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: <any>undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be an Array.")
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: <any>false,
        expectedResult: new Error("Property a.property.path with value false must be an Array.")
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: <any>{},
        expectedResult: new Error("Property a.property.path with value {} must be an Array.")
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [],
        expectedResult: []
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: <any>[9],
        expectedResult: new Error("Property a.property.path.0 with value 9 must be a string.")
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: ["9"],
        expectedResult: ["9"]
      });
    });
  });
});