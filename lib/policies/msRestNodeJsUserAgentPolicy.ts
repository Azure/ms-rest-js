// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as os from "os";
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { BaseRequestPolicy, RequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import { Constants } from "../util/constants";

/**
 * Get a RequestPolicyFactory that creates adds the ms-rest user agent to outgoing requests.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
export function msRestNodeJsUserAgentPolicy(userAgentInfo: string[]): RequestPolicyFactory {
    return (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
        return new MsRestNodeJsUserAgentPolicy(userAgentInfo, nextPolicy, options);
    };
}

class MsRestNodeJsUserAgentPolicy extends BaseRequestPolicy {
    constructor(private readonly _userAgentInfo: string[], nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
        super(nextPolicy, options);
    }

    send(request: HttpRequest): Promise<HttpResponse> {
        if (!request.headers.get(Constants.HeaderConstants.USER_AGENT)) {
            const osInfo = `(${os.arch()}-${os.type()}-${os.release()})`;
            if (this._userAgentInfo.indexOf(osInfo) === -1) {
                this._userAgentInfo.unshift(osInfo);
            }

            const runtimeInfo = `Node/${process.version}`;
            if (this._userAgentInfo.indexOf(runtimeInfo) === -1) {
                this._userAgentInfo.unshift(runtimeInfo);
            }

            const nodeSDKSignature = `Azure-SDK-For-Node`;
            if (this._userAgentInfo.indexOf(nodeSDKSignature) === -1) {
                const azureRuntime = `ms-rest-azure`;

                let insertIndex = this._userAgentInfo.indexOf(azureRuntime);
                // insert after azureRuntime, otherwise, insert last.
                insertIndex = insertIndex < 0 ? this._userAgentInfo.length : insertIndex + 1;
                this._userAgentInfo.splice(insertIndex, 0, nodeSDKSignature);
            }

            request.headers.set(Constants.HeaderConstants.USER_AGENT, this._userAgentInfo.join(" "));
        }
        return this._nextPolicy.send(request);
    }
}