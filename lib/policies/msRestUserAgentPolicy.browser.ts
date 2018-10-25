// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { MsRestUserAgentBase } from "./msRestUserAgentBase";
import { HttpOperationResponse } from "../httpOperationResponse";
import { WebResource } from "../webResource";
import { RequestPolicy, RequestPolicyOptions } from "./requestPolicy";

export const msRestUserAgentPolicy: any = () => {
  throw new Error("msRestUserAgentPolicy not supported in browser");
};

export class MsRestUserAgentPolicy extends MsRestUserAgentBase {

  userAgentInfo: Array<string>;

  constructor(nextPolicy: RequestPolicy, options: RequestPolicyOptions, userAgentInfo: Array<string>) {
    super(nextPolicy, options);
    this.userAgentInfo = userAgentInfo;
  }

  public sendRequest(webResource: WebResource): Promise<HttpOperationResponse> {
    throw new Error("Method not implemented.");
  }
}