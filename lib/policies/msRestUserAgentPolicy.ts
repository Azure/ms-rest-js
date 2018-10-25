// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { RequestPolicy, RequestPolicyFactory, RequestPolicyOptions } from "./requestPolicy";
import { MsRestUserAgentBase } from "./msRestUserAgentBase";
import { Constants } from "../util/constants";

export function msRestUserAgentPolicy(userAgentInfo: Array<string>): RequestPolicyFactory {
  return {
    create: (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
      return new MsRestUserAgentPolicy(nextPolicy, options, userAgentInfo);
    }
  };
}

export class MsRestUserAgentPolicy extends MsRestUserAgentBase {
  protected getUserAgentKey(): string {
    return Constants.HeaderConstants.USER_AGENT;
  }

  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, userAgentInfo: Array<string>) {
    super(nextPolicy, options, userAgentInfo);
    this.userAgentInfo = userAgentInfo;
  }
}
