// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import sequenceSpec from "../../lib/serialization/sequenceSpec";
import stringSpec from "../../lib/serialization/stringSpec";
import { TypeSpec } from "../../lib/serialization/typeSpec";
import { serializeTest, deserializeTest } from "./specTest";

describe("sequenceSpec", () => {
  it("should have \"Sequence\" for its specType property", () => {
    assert.strictEqual("Sequence", sequenceSpec(stringSpec).specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function sequenceSerializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { elementSpec: TypeSpec<TSerialized, TDeserialized>, value: TDeserialized[], expectedResult: TSerialized[] | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: sequenceSpec(args.elementSpec),
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an Array."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an Array.`]
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an Array."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an Array.`]
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: {} as any,
        expectedResult: new Error("Property a.property.path with value {} must be an Array."),
        expectedLogs: [`ERROR: Property a.property.path with value {} must be an Array.`]
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [],
        expectedResult: []
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [9] as any,
        expectedResult: new Error("Property a.property.path.0 with value 9 must be a string."),
        expectedLogs: [`ERROR: Property a.property.path.0 with value 9 must be a string.`]
      });

      sequenceSerializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: ["9"],
        expectedResult: ["9"]
      });
    });

    describe("without strict type-checking", () => {
      function sequenceSerializeWithoutStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { elementSpec: TypeSpec<TSerialized, TDeserialized>, value: TDeserialized[], expectedResult: TSerialized[] | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: sequenceSpec(args.elementSpec),
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      sequenceSerializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an Array.`]
      });

      sequenceSerializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an Array.`]
      });

      sequenceSerializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: {} as any,
        expectedResult: {} as any,
        expectedLogs: [`WARNING: Property a.property.path with value {} should be an Array.`]
      });

      sequenceSerializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [],
        expectedResult: []
      });

      sequenceSerializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [9] as any,
        expectedResult: [9] as any,
        expectedLogs: [`WARNING: Property a.property.path.0 with value 9 should be a string.`]
      });

      sequenceSerializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: ["9"],
        expectedResult: ["9"]
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function sequenceDeserializeWithStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { elementSpec: TypeSpec<TSerialized, TDeserialized>, value: TSerialized[], expectedResult: TDeserialized[] | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: sequenceSpec(args.elementSpec),
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      sequenceDeserializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an Array."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an Array.`]
      });

      sequenceDeserializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an Array."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an Array.`]
      });

      sequenceDeserializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: {} as any,
        expectedResult: new Error("Property a.property.path with value {} must be an Array."),
        expectedLogs: [`ERROR: Property a.property.path with value {} must be an Array.`]
      });

      sequenceDeserializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [],
        expectedResult: []
      });

      sequenceDeserializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [9] as any,
        expectedResult: new Error("Property a.property.path.0 with value 9 must be a string."),
        expectedLogs: [`ERROR: Property a.property.path.0 with value 9 must be a string.`]
      });

      sequenceDeserializeWithStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: ["9"],
        expectedResult: ["9"]
      });
    });

    describe("without strict type-checking", () => {
      function sequenceDeserializeWithoutStrictTypeCheckingTest<TSerialized, TDeserialized>(args: { elementSpec: TypeSpec<TSerialized, TDeserialized>, value: TSerialized[], expectedResult: TDeserialized[] | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: sequenceSpec(args.elementSpec),
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      sequenceDeserializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an Array.`]
      });

      sequenceDeserializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an Array.`]
      });

      sequenceDeserializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: {} as any,
        expectedResult: {} as any,
        expectedLogs: [`WARNING: Property a.property.path with value {} should be an Array.`]
      });

      sequenceDeserializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [],
        expectedResult: []
      });

      sequenceDeserializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: [9] as any,
        expectedResult: [9] as any,
        expectedLogs: [`WARNING: Property a.property.path.0 with value 9 should be a string.`]
      });

      sequenceDeserializeWithoutStrictTypeCheckingTest({
        elementSpec: stringSpec,
        value: ["9"],
        expectedResult: ["9"]
      });
    });
  });
});