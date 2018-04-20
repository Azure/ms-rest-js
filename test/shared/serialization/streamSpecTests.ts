// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import streamSpec from "../../../lib/serialization/streamSpec";
import { deserializeTest, serializeTest } from "./specTest";

describe("objectSpec", () => {
  it("should have \"Stream\" for its typeName property", () => {
    assert.strictEqual("Stream", streamSpec.specType);
  });

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function streamSerializeWithStrictTypeCheckingTest(args: { value: any, expectedResult: any | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: streamSpec,
          options: {
            serializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      streamSerializeWithStrictTypeCheckingTest({
        value: undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a Stream."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a Stream.`]
      });

      streamSerializeWithStrictTypeCheckingTest({
        value: false,
        expectedResult: new Error("Property a.property.path with value false must be a Stream."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a Stream.`]
      });

      streamSerializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: new Error("Property a.property.path with value {} must be a Stream."),
        expectedLogs: [`ERROR: Property a.property.path with value {} must be a Stream.`]
      });

      streamSerializeWithStrictTypeCheckingTest({
        value: [],
        expectedResult: new Error("Property a.property.path with value [] must be a Stream."),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be a Stream.`]
      });
    });

    describe("without strict type-checking", () => {
      function streamSerializeWithoutStrictTypeCheckingTest(args: { value: any, expectedResult: any | Error, expectedLogs?: string[] }): void {
        serializeTest({
          typeSpec: streamSpec,
          options: {
            serializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      streamSerializeWithoutStrictTypeCheckingTest({
        value: undefined,
        expectedResult: undefined,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a Stream.`]
      });

      streamSerializeWithoutStrictTypeCheckingTest({
        value: false,
        expectedResult: false,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a Stream.`]
      });

      streamSerializeWithoutStrictTypeCheckingTest({
        value: {},
        expectedResult: {},
        expectedLogs: [`WARNING: Property a.property.path with value {} should be a Stream.`]
      });

      streamSerializeWithoutStrictTypeCheckingTest({
        value: [],
        expectedResult: [],
        expectedLogs: [`WARNING: Property a.property.path with value [] should be a Stream.`]
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function streamDeserializeWithStrictTypeCheckingTest(args: { value: any, expectedResult: any | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: streamSpec,
          options: {
            deserializationStrictTypeChecking: true
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      streamDeserializeWithStrictTypeCheckingTest({
        value: undefined,
        expectedResult: new Error("Property a.property.path with value undefined must be a Stream."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be a Stream.`]
      });

      streamDeserializeWithStrictTypeCheckingTest({
        value: false,
        expectedResult: new Error("Property a.property.path with value false must be a Stream."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be a Stream.`]
      });

      streamDeserializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: new Error("Property a.property.path with value {} must be a Stream."),
        expectedLogs: [`ERROR: Property a.property.path with value {} must be a Stream.`]
      });

      streamDeserializeWithStrictTypeCheckingTest({
        value: [],
        expectedResult: new Error("Property a.property.path with value [] must be a Stream."),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be a Stream.`]
      });
    });

    describe("without strict type-checking", () => {
      function streamDeserializeWithoutStrictTypeCheckingTest(args: { value: any, expectedResult: any | Error, expectedLogs?: string[] }): void {
        deserializeTest({
          typeSpec: streamSpec,
          options: {
            deserializationStrictTypeChecking: false
          },
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      streamDeserializeWithoutStrictTypeCheckingTest({
        value: undefined,
        expectedResult: undefined,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be a Stream.`]
      });

      streamDeserializeWithoutStrictTypeCheckingTest({
        value: false,
        expectedResult: false,
        expectedLogs: [`WARNING: Property a.property.path with value false should be a Stream.`]
      });

      streamDeserializeWithoutStrictTypeCheckingTest({
        value: {},
        expectedResult: {},
        expectedLogs: [`WARNING: Property a.property.path with value {} should be a Stream.`]
      });

      streamDeserializeWithoutStrictTypeCheckingTest({
        value: [],
        expectedResult: [],
        expectedLogs: [`WARNING: Property a.property.path with value [] should be a Stream.`]
      });
    });
  });
});