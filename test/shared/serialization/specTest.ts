// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { SerializationOptions } from "../../../lib/serialization/serializationOptions";
import { PropertyPath } from "../../../lib/serialization/propertyPath";
import { TypeSpec } from "../../../lib/serialization/typeSpec";
import { InMemoryHttpPipelineLogger } from "../inMemoryHttpPipelineLogger";

export function serializeTest<TSerialized, TDeserialized>(args: { testName?: string, typeSpec: TypeSpec<TSerialized, TDeserialized>, propertyPath?: string[], value: TDeserialized, options?: SerializationOptions, expectedResult: TSerialized | Error, expectedLogs?: string[] }): void {
  const propertyPath: string[] = args.propertyPath || ["a", "property", "path"];

  const logger = new InMemoryHttpPipelineLogger();
  const options: SerializationOptions = args.options || {};
  options.logger = logger;

  const expectedResult: TSerialized | Error = args.expectedResult;
  const expectedLogs: string[] = args.expectedLogs || [];

  if (expectedResult instanceof Error) {
    it(args.testName || `should throw an error when given ${JSON.stringify(args.value)}`, () => {
      try {
        args.typeSpec.serialize(new PropertyPath(propertyPath), args.value, options);
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.deepEqual(error.message, expectedResult.message);
      }
      assert.deepEqual(logger.logs, expectedLogs);
    });
  } else {
    it(args.testName || `should return ${JSON.stringify(expectedResult)} when given ${JSON.stringify(args.value)}`, () => {
      assert.deepEqual(args.typeSpec.serialize(new PropertyPath(propertyPath), args.value, options), expectedResult);
      assert.deepEqual(logger.logs, expectedLogs);
    });
  }
}

export function deserializeTest<TSerialized, TDeserialized>(args: { testName?: string, typeSpec: TypeSpec<TSerialized, TDeserialized>, propertyPath?: string[], value: TSerialized, options?: SerializationOptions, expectedResult: TDeserialized | Error, expectedLogs?: string[] }): void {
  const propertyPath: string[] = args.propertyPath || ["a", "property", "path"];

  const logger = new InMemoryHttpPipelineLogger();
  const options: SerializationOptions = args.options || {};
  options.logger = logger;

  const expectedResult: TDeserialized | Error = args.expectedResult;
  const expectedLogs: string[] = args.expectedLogs || [];

  if (expectedResult instanceof Error) {
    it(args.testName || `should throw an error when given ${JSON.stringify(args.value)}`, () => {
      try {
        args.typeSpec.deserialize(new PropertyPath(propertyPath), args.value, options);
        assert.fail("Expected an error to be thrown.");
      } catch (error) {
        assert.deepEqual(error.message, expectedResult.message);
      }
      assert.deepEqual(logger.logs, expectedLogs);
    });
  } else {
    it(args.testName || `should return ${JSON.stringify(expectedResult)} when given ${JSON.stringify(args.value)}`, () => {
      assert.deepEqual(args.typeSpec.deserialize(new PropertyPath(propertyPath), args.value, options), expectedResult);
      assert.deepEqual(logger.logs, expectedLogs);
    });
  }
}