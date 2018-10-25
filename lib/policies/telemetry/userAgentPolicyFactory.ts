// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { RequestPolicy, RequestPolicyOptions, RequestPolicyFactory } from "../requestPolicy";
import { UserAgentPolicy } from "./userAgentPolicy";
import { Constants } from "../../util/constants";
import { getPlatformSpecificData, getUserAgentKey } from "./msRestUserAgentPolicy";

export type TelemetryInfo = { key: string; value?: string };

function getRuntimeInfo(): TelemetryInfo[] {
    const sdkSignature = {
        key: "azure-sdk-for-js"
    };

    const msRestRuntime = {
        key: "ms-rest-js",
        value: Constants.msRestVersion
    };

    return [ sdkSignature, msRestRuntime ];
}

function getUserAgentString(telemetryInfo: TelemetryInfo[], keySeparator = " ", valueSeparator = "/"): string {
    return telemetryInfo.map(info => {
        const value = info.value ? `${valueSeparator}${info.value}` : "";
        return `${info.key}${value}`;
    }).join(keySeparator);
}

function getHeaderValue(): string {
    const runtimeInfo = getRuntimeInfo();
    const platformSpecificData = getPlatformSpecificData();
    const userAgent = getUserAgentString(runtimeInfo.concat(platformSpecificData));
    return userAgent;
}


export function userAgentPolicy(headerKey?: string, headerValue?: string): RequestPolicyFactory {
    const key: string = headerKey || getUserAgentKey();
    const value: string = headerValue || getHeaderValue();

    return {
        create: (nextPolicy: RequestPolicy, options: RequestPolicyOptions) => {
            return new UserAgentPolicy(nextPolicy, options, key, value);
        }
    };
}