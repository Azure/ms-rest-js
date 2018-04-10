// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as assert from "assert";
import { RequestPolicyOptions } from "../lib/requestPolicyOptions";
import { InMemoryHttpPipelineLogger } from "./inMemoryHttpPipelineLogger";
import { HttpPipelineLogLevel } from "../lib/httpPipelineLogLevel";

describe("RequestPolicyOptions", () => {
  describe("shouldLog()", () => {
    it("should return false when the logger is undefined", () => {
      const requestPolicyOptions = new RequestPolicyOptions(undefined);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.OFF), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.INFO), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.WARNING), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.ERROR), false);
    });

    it("should return false when the minimumLogLevel is OFF", () => {
      const logger = new InMemoryHttpPipelineLogger(HttpPipelineLogLevel.OFF);
      const requestPolicyOptions = new RequestPolicyOptions(logger);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.OFF), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.INFO), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.WARNING), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.ERROR), false);
    });

    it("should return false when the minimumLogLevel is INFO", () => {
      const logger = new InMemoryHttpPipelineLogger(HttpPipelineLogLevel.INFO);
      const requestPolicyOptions = new RequestPolicyOptions(logger);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.OFF), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.INFO), true);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.WARNING), true);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.ERROR), true);
    });

    it("should return false when the minimumLogLevel is WARNING", () => {
      const logger = new InMemoryHttpPipelineLogger(HttpPipelineLogLevel.WARNING);
      const requestPolicyOptions = new RequestPolicyOptions(logger);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.OFF), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.INFO), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.WARNING), true);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.ERROR), true);
    });

    it("should return false when the minimumLogLevel is ERROR", () => {
      const logger = new InMemoryHttpPipelineLogger(HttpPipelineLogLevel.ERROR);
      const requestPolicyOptions = new RequestPolicyOptions(logger);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.OFF), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.INFO), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.WARNING), false);
      assert.strictEqual(requestPolicyOptions.shouldLog(HttpPipelineLogLevel.ERROR), true);
    });
  });

  describe("log()", () => {
    it("should not log when the logger is undefined", () => {
      const requestPolicyOptions = new RequestPolicyOptions(undefined);
      requestPolicyOptions.log(HttpPipelineLogLevel.OFF, "Message 1");
      requestPolicyOptions.log(HttpPipelineLogLevel.INFO, "Message 2");
      requestPolicyOptions.log(HttpPipelineLogLevel.WARNING, "Message 3");
      requestPolicyOptions.log(HttpPipelineLogLevel.ERROR, "Message 4");
    });

    it("should not log when the minimumLogLevel is OFF", () => {
      const logger = new InMemoryHttpPipelineLogger(HttpPipelineLogLevel.OFF);
      const requestPolicyOptions = new RequestPolicyOptions(logger);

      requestPolicyOptions.log(HttpPipelineLogLevel.OFF, "Message 1");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.INFO, "Message 2");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.WARNING, "Message 3");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.ERROR, "Message 4");
      assert.deepStrictEqual(logger.logs, []);
    });

    it("should not log when the minimumLogLevel is INFO", () => {
      const logger = new InMemoryHttpPipelineLogger(HttpPipelineLogLevel.INFO);
      const requestPolicyOptions = new RequestPolicyOptions(logger);

      requestPolicyOptions.log(HttpPipelineLogLevel.OFF, "Message 1");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.INFO, "Message 2");
      assert.deepStrictEqual(logger.logs, [
        "INFO: Message 2"
      ]);

      requestPolicyOptions.log(HttpPipelineLogLevel.WARNING, "Message 3");
      assert.deepStrictEqual(logger.logs, [
        "INFO: Message 2",
        "WARNING: Message 3"
      ]);

      requestPolicyOptions.log(HttpPipelineLogLevel.ERROR, "Message 4");
      assert.deepStrictEqual(logger.logs, [
        "INFO: Message 2",
        "WARNING: Message 3",
        "ERROR: Message 4"
      ]);
    });

    it("should not log when the minimumLogLevel is WARNING", () => {
      const logger = new InMemoryHttpPipelineLogger(HttpPipelineLogLevel.WARNING);
      const requestPolicyOptions = new RequestPolicyOptions(logger);

      requestPolicyOptions.log(HttpPipelineLogLevel.OFF, "Message 1");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.INFO, "Message 2");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.WARNING, "Message 3");
      assert.deepStrictEqual(logger.logs, [
        "WARNING: Message 3"
      ]);

      requestPolicyOptions.log(HttpPipelineLogLevel.ERROR, "Message 4");
      assert.deepStrictEqual(logger.logs, [
        "WARNING: Message 3",
        "ERROR: Message 4"
      ]);
    });

    it("should not log when the minimumLogLevel is ERROR", () => {
      const logger = new InMemoryHttpPipelineLogger(HttpPipelineLogLevel.ERROR);
      const requestPolicyOptions = new RequestPolicyOptions(logger);

      requestPolicyOptions.log(HttpPipelineLogLevel.OFF, "Message 1");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.INFO, "Message 2");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.WARNING, "Message 3");
      assert.deepStrictEqual(logger.logs, []);

      requestPolicyOptions.log(HttpPipelineLogLevel.ERROR, "Message 4");
      assert.deepStrictEqual(logger.logs, [
        "ERROR: Message 4"
      ]);
    });
  });
});