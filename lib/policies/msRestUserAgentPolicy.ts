// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as os from "os";
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
  protected addPlatformSpecificData(userAgentInfo: string[]): string[] {
    const osInfo = `(${os.arch()}-${os.type()}-${os.release()})`;
    if (userAgentInfo.indexOf(osInfo) === -1) {
      userAgentInfo.unshift(osInfo);
    }

    const runtimeInfo = `Node/${process.version}`;
    if (userAgentInfo.indexOf(runtimeInfo) === -1) {
      userAgentInfo.unshift(runtimeInfo);
    }

    return userAgentInfo;
  }

  protected getUserAgentKey(): string {
    return Constants.HeaderConstants.USER_AGENT;
  }

  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, userAgentInfo: Array<string>) {
    super(nextPolicy, options, userAgentInfo);
    this.userAgentInfo = userAgentInfo;
  }
}
