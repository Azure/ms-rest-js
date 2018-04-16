// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { SerializationOptions } from "../../lib/serialization/serializationOptions";
import { SpecPath } from "../../lib/serialization/specPath";
import { TypeSpec } from "../../lib/serialization/typeSpec";

export function serializeTest<TSerialized, TDeserialized>(args: { testName?: string, typeSpec: TypeSpec<TSerialized, TDeserialized>, propertyPath?: string[], value: TDeserialized, options?: SerializationOptions, expectedResult: TSerialized | Error }): void {
  const propertyPath: string[] = args.propertyPath || ["a", "property", "path"];

  const options: SerializationOptions = args.options || {};

  const expectedResult: TSerialized | Error = args.expectedResult;

  if (expectedResult instanceof Error) {
    it(args.testName || `should throw an error when given ${JSON.stringify(args.value)}`, () => {
      try {
        args.typeSpec.serialize(new SpecPath(propertyPath), args.value, options);
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.deepEqual(error.message, expectedResult.message);
      }
    });
  } else {
    it(args.testName || `should return ${JSON.stringify(expectedResult)} when given ${JSON.stringify(args.value)}`, () => {
      assert.deepEqual(args.typeSpec.serialize(new SpecPath(propertyPath), args.value, options), expectedResult);
    });
  }
}

export function deserializeTest<TSerialized, TDeserialized>(args: { testName?: string, typeSpec: TypeSpec<TSerialized, TDeserialized>, propertyPath?: string[], value: TSerialized, options?: SerializationOptions, expectedResult: TDeserialized | Error }): void {
  const propertyPath: string[] = args.propertyPath || ["a", "property", "path"];

  const options: SerializationOptions = args.options || {};

  const expectedResult: TDeserialized | Error = args.expectedResult;

  if (expectedResult instanceof Error) {
    it(args.testName || `should throw an error when given ${JSON.stringify(args.value)}`, () => {
      try {
        args.typeSpec.deserialize(new SpecPath(propertyPath), args.value, options);
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.deepEqual(error.message, expectedResult.message);
      }
    });
  } else {
    it(args.testName || `should return ${JSON.stringify(expectedResult)} when given ${JSON.stringify(args.value)}`, () => {
      assert.deepEqual(args.typeSpec.deserialize(new SpecPath(propertyPath), args.value, options), expectedResult);
    });
  }
}