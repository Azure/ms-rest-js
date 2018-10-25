
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { BaseRequestPolicy, RequestPolicy, RequestPolicyOptions } from "./requestPolicy";

export abstract class MsRestUserAgentBase extends BaseRequestPolicy {
    protected constructor(readonly _nextPolicy: RequestPolicy, readonly _options: RequestPolicyOptions) {
        super(_nextPolicy, _options);
    }
}