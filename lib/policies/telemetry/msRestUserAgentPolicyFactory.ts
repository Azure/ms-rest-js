// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { RequestPolicy, RequestPolicyOptions, RequestPolicyFactory } from "../requestPolicy";
import { MsRestUserAgentPolicy } from "./msRestUserAgentPolicy";

export function msRestUserAgentPolicy(overriddenUserAgent?: string): RequestPolicyFactory {
    return {
        create: (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
            return new MsRestUserAgentPolicy(nextPolicy, options, overriddenUserAgent);
        }
    };
}