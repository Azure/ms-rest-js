// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { BaseRequestPolicy, RequestPolicy, RequestPolicyOptions } from "../requestPolicy";
import { WebResource, HttpHeaders, HttpOperationResponse } from "../../msRest";
import { Constants } from "../../util/constants";

export type TelemetryInfo = { key: string; value?: string };

export abstract class MsRestUserAgentBase extends BaseRequestPolicy {
    protected constructor(readonly _nextPolicy: RequestPolicy, readonly _options: RequestPolicyOptions, protected _overriddenUserAgent?: string) {
        super(_nextPolicy, _options);
    }

    sendRequest(request: WebResource): Promise<HttpOperationResponse> {
        this.addUserAgentHeader(request);
        return this._nextPolicy.sendRequest(request);
    }

    addUserAgentHeader(request: WebResource): void {
        if (!request.headers) {
            request.headers = new HttpHeaders();
        }

        if (!request.headers.get(this.getUserAgentKey())) {
            this._tagRequest(request);
        }
    }

    protected abstract getUserAgentKey(): string;
    protected abstract getPlatformSpecificData(): TelemetryInfo[];

    private _tagRequest(request: WebResource): void {
        let userAgent;

        if (this._overriddenUserAgent) {
            userAgent = this._overriddenUserAgent;
        } else {
            const runtimeInfo = this._getRuntimeInfo();
            const platformSpecificData = this.getPlatformSpecificData();
            userAgent = this._getUserAgentString(runtimeInfo.concat(platformSpecificData));
        }

        request.headers.set(this.getUserAgentKey(), userAgent);
    }

    private _getRuntimeInfo(): TelemetryInfo[] {
        const sdkSignature = {
            key: "azure-sdk-for-js"
        };

        const msRestRuntime = {
            key: `ms-rest-js`,
            value: Constants.msRestVersion
        };

        return [ sdkSignature, msRestRuntime ];
    }

    private _getUserAgentString(telemetryInfo: TelemetryInfo[], keySeparator = " ", valueSeparator = "/"): string {
        return telemetryInfo.map(info => {
            const value = info.value ? `${valueSeparator}${info.value}` : "";
            return `${info.key}${value}`;
        }).join(keySeparator);
    }
}