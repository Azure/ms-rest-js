// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { HttpPipelineLogger } from "../lib/httpPipelineLogger";
import { HttpPipelineLogLevel, httpPipelineLogLevelToString } from "../lib/httpPipelineLogLevel";

/**
 * An in-memory HttpPipelineLogger that can be used for testing.
 */
export class InMemoryHttpPipelineLogger implements HttpPipelineLogger {
    private readonly _logs: string[];

    constructor(private _minimumLogLevel: HttpPipelineLogLevel = HttpPipelineLogLevel.INFO) {
        this._logs = [];
    }

    /**
     * Get the logs that have been written to this HttpPipelineLogger.
     */
    public get logs(): string[] {
        return this._logs;
    }

    public get minimumLogLevel(): HttpPipelineLogLevel {
        return this._minimumLogLevel;
    }

    public set minimumLogLevel(minimumLogLevel: HttpPipelineLogLevel) {
        this._minimumLogLevel = minimumLogLevel;
    }

    public log(logLevel: HttpPipelineLogLevel, message: string): void {
        const logLevelString: string = httpPipelineLogLevelToString(logLevel);
        this._logs.push(`${logLevelString}: ${message}`);
    }
}