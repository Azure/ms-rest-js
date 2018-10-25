// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as os from "os";
import { TelemetryInfo } from "./userAgentPolicyFactory";
import { Constants } from "../../util/constants";

export function getPlatformSpecificData(): TelemetryInfo[] {
  const osInfo = {
    key: "OS",
    value: `(${os.arch()}-${os.type()}-${os.release()})`
  };

  const runtimeInfo = {
    key: "Node",
    value: process.version
  };

  return [osInfo, runtimeInfo];
}

export function getUserAgentKey(): string {
  return Constants.HeaderConstants.USER_AGENT;
}
