// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { MsRestUserAgentBase, TelemetryInfo } from "./msRestUserAgentPolicyBase";
import { RequestPolicy, RequestPolicyOptions } from "../requestPolicy";

interface NavigatorEx extends Navigator {
  readonly oscpu: string | undefined;
}

export class MsRestUserAgentPolicy extends MsRestUserAgentBase {
  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, overriddenUserAgent?: string) {
    super(nextPolicy, options, overriddenUserAgent);
  }

  protected getUserAgentKey(): string {
    return "x-ms-commandname";
  }

  protected getPlatformSpecificData(): TelemetryInfo[] {
    const navigator = window.navigator as NavigatorEx;
    const osInfo = {
      key: "OS",
      value: navigator.oscpu || navigator.platform
    };

    return [osInfo];
  }
}