// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { TelemetryInfo } from "./userAgentPolicyFactory";

interface NavigatorEx extends Navigator {
  readonly oscpu: string | undefined;
}

export function getUserAgentKey(): string {
  return "x-ms-command-name";
}

export function getPlatformSpecificData(): TelemetryInfo[] {
  const navigator = window.navigator as NavigatorEx;
  const osInfo = {
    key: "OS",
    value: navigator.oscpu || navigator.platform
  };

  return [osInfo];
}