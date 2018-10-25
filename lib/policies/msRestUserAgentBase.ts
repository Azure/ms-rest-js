// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as os from "os";
import { BaseRequestPolicy, RequestPolicy, RequestPolicyOptions } from "./requestPolicy";
import { WebResource, HttpHeaders, HttpOperationResponse } from "../msRest";

export abstract class MsRestUserAgentBase extends BaseRequestPolicy {
    protected userAgentInfo: Array<string>;

    protected constructor(readonly _nextPolicy: RequestPolicy, readonly _options: RequestPolicyOptions, userAgentInfo: Array<string>) {
        super(_nextPolicy, _options);
        this.userAgentInfo = userAgentInfo;
    }

    tagRequest(request: WebResource): void {
        const osInfo = `(${os.arch()}-${os.type()}-${os.release()})`;
        if (this.userAgentInfo.indexOf(osInfo) === -1) {
            this.userAgentInfo.unshift(osInfo);
        }

        const runtimeInfo = `Node/${process.version}`;
        if (this.userAgentInfo.indexOf(runtimeInfo) === -1) {
            this.userAgentInfo.unshift(runtimeInfo);
        }

        const nodeSDKSignature = `azure-sdk-for-js`;
        if (this.userAgentInfo.indexOf(nodeSDKSignature) === -1) {
            const azureRuntime = `ms-rest-azure-js`;

            let insertIndex = this.userAgentInfo.indexOf(azureRuntime);
            // insert after azureRuntime, otherwise, insert last.
            insertIndex = insertIndex < 0 ? this.userAgentInfo.length : insertIndex + 1;
            this.userAgentInfo.splice(insertIndex, 0, nodeSDKSignature);
        }

        request.headers.set(this.getUserAgentKey(), this.userAgentInfo.join(" "));
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

    public sendRequest(request: WebResource): Promise<HttpOperationResponse> {
        this.addUserAgentHeader(request);
        return this._nextPolicy.sendRequest(request);
    }
}