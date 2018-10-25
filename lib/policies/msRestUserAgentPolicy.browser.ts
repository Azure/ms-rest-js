// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { MsRestUserAgentBase } from "./msRestUserAgentBase";
import { RequestPolicy, RequestPolicyOptions } from "./requestPolicy";

export const msRestUserAgentPolicy: any = () => {
  throw new Error("msRestUserAgentPolicy not supported in browser");
};

export class MsRestUserAgentPolicy extends MsRestUserAgentBase {
  protected getUserAgentKey(): string {
    return "x-ms-commandname";
  }

  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, userAgentInfo: Array<string>) {
    super(nextPolicy, options, userAgentInfo);
  }
}