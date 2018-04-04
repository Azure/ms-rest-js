// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpPipelineLogLevel, httpPipelineLogLevelToString } from "../lib/httpPipelineLogLevel";
import * as assert from "assert";

describe("httpPipelineLogLevelToString()", () => {
    it(`should work with ERROR`, () => {
        assert.strictEqual(httpPipelineLogLevelToString(HttpPipelineLogLevel.ERROR), "ERROR");
    });

    it(`should work with INFO`, () => {
        assert.strictEqual(httpPipelineLogLevelToString(HttpPipelineLogLevel.INFO), "INFO");
    });

    it(`should work with WARNING`, () => {
        assert.strictEqual(httpPipelineLogLevelToString(HttpPipelineLogLevel.WARNING), "WARNING");
    });

    it(`should work with OFF`, () => {
        assert.strictEqual(httpPipelineLogLevelToString(HttpPipelineLogLevel.OFF), "OFF");
    });
});