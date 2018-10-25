// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { BaseRequestPolicy, RequestPolicy, RequestPolicyOptions } from "./requestPolicy";
import { WebResource, HttpHeaders, HttpOperationResponse } from "../msRest";

export abstract class MsRestUserAgentBase extends BaseRequestPolicy {
    protected _userAgentInfo: Array<string>;

    protected constructor(readonly _nextPolicy: RequestPolicy, readonly _options: RequestPolicyOptions, userAgentInfo: Array<string>) {
        super(_nextPolicy, _options);
        this._userAgentInfo = userAgentInfo;
    }

    tagRequest(request: WebResource): void {
        const userAgentInfo = this._userAgentInfo;
        this.addRuntimeInfo(userAgentInfo);
        this.addPlatformSpecificData(userAgentInfo);
        request.headers.set(this.getUserAgentKey(), userAgentInfo.join(" "));
    }

    addRuntimeInfo(userAgentInfo: string[]): string[] {
        const jsSdkSignature = "azure-sdk-for-js";

        if (userAgentInfo.includes(jsSdkSignature)) {
            const azureRuntime = `ms-rest-azure-js`;
            let insertIndex = userAgentInfo.indexOf(azureRuntime);
            // insert after azureRuntime, otherwise, insert last.
            insertIndex = insertIndex < 0 ? userAgentInfo.length : insertIndex + 1;
            userAgentInfo.splice(insertIndex, 0, jsSdkSignature);
        }

        return userAgentInfo;
    }

    addUserAgentHeader(request: WebResource): void {
        if (!request.headers) {
            request.headers = new HttpHeaders();
        }

        if (!request.headers.get(this.getUserAgentKey())) {
            this.tagRequest(request);
        }
    }

    protected abstract getUserAgentKey(): string;
    protected abstract addPlatformSpecificData(userAgentInfo: string[]): string[];

    public sendRequest(request: WebResource): Promise<HttpOperationResponse> {
        this.addUserAgentHeader(request);
        return this._nextPolicy.sendRequest(request);
    }
}