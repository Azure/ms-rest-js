// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { InMemoryHttpPipelineLogger } from "./inMemoryHttpPipelineLogger";
import * as assert from "assert";
import { HttpPipelineLogLevel } from "../lib/httpPipelineLogLevel";

describe("InMemoryHttpPipelineLogger", () => {
  it("should store logs", () => {
    const logger = new InMemoryHttpPipelineLogger();
    assert.deepStrictEqual(logger.logs, []);

    logger.log(HttpPipelineLogLevel.INFO, "Message 1");
    assert.deepStrictEqual(logger.logs, [
      "INFO: Message 1"
    ]);

    logger.log(HttpPipelineLogLevel.WARNING, "Message 2");
    assert.deepStrictEqual(logger.logs, [
      "INFO: Message 1",
      "WARNING: Message 2"
    ]);

    logger.log(HttpPipelineLogLevel.ERROR, "Message 3");
    assert.deepStrictEqual(logger.logs, [
      "INFO: Message 1",
      "WARNING: Message 2",
      "ERROR: Message 3"
    ]);

    logger.log(HttpPipelineLogLevel.OFF, "Message 4");
    assert.deepStrictEqual(logger.logs, [
      "INFO: Message 1",
      "WARNING: Message 2",
      "ERROR: Message 3",
      "OFF: Message 4"
    ]);
  });

  it("should update the minimumLogLevel", () => {
    const logger = new InMemoryHttpPipelineLogger();
    assert.strictEqual(logger.minimumLogLevel, HttpPipelineLogLevel.INFO);

    logger.minimumLogLevel = HttpPipelineLogLevel.OFF;
    assert.strictEqual(logger.minimumLogLevel, HttpPipelineLogLevel.OFF);

    logger.minimumLogLevel = HttpPipelineLogLevel.ERROR;
    assert.strictEqual(logger.minimumLogLevel, HttpPipelineLogLevel.ERROR);
  });
});