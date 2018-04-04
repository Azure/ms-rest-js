// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { RequestPolicy, BaseRequestPolicy } from "../requestPolicy";
import { RequestPolicyFactory } from "../requestPolicyFactory";
import { RequestPolicyOptions } from "../requestPolicyOptions";
import { HttpRequest } from "../httpRequest";
import { HttpResponse } from "../httpResponse";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
export class UserAgentRequestPolicyFactory implements RequestPolicyFactory {
    constructor(private _userAgent: string) {
    }

    public create(nextPolicy: RequestPolicy, options: RequestPolicyOptions): RequestPolicy {
        return new UserAgentRequestPolicy(this._userAgent, nextPolicy, options);
    }
}

class UserAgentRequestPolicy extends BaseRequestPolicy {
    constructor(private _userAgent: string, nextPolicy: RequestPolicy, options: RequestPolicyOptions) {
        super(nextPolicy, options);
    }

    send(request: HttpRequest): Promise<HttpResponse> {
        this.log(HttpPipelineLogLevel.INFO, `Set "User-Agent" header to "${this._userAgent}".`)
        request.headers['User-Agent'] = this._userAgent;
        return this.nextPolicy.send(request);
    }
}