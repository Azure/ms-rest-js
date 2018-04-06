// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { FetchHttpClient } from "./fetchHttpClient";
import { HttpClient } from "./httpClient";
import { HttpPipelineOptions } from "./httpPipelineOptions";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { RequestPolicy } from "./requestPolicy";
import { RequestPolicyFactory } from "./requestPolicyFactory";
import { RequestPolicyOptions } from "./requestPolicyOptions";

let defaultHttpClient: HttpClient;

function getDefaultHttpClient(): HttpClient {
    if (!defaultHttpClient) {
        defaultHttpClient = new FetchHttpClient();
    }
    return defaultHttpClient;
}

/**
 * A collection of RequestPolicies that will be applied to a HTTP request before it is sent and will
 * be applied to a HTTP response when it is received.
 */
export class HttpPipeline {
    private readonly httpClient: HttpClient;
    private readonly requestPolicyOptions: RequestPolicyOptions;

    constructor(private readonly requestPolicyFactories: RequestPolicyFactory[], private readonly options: HttpPipelineOptions) {
        if (!this.options) {
            this.options = {};
        }

        if (!this.options.httpClient) {
            this.options.httpClient = getDefaultHttpClient();
        }

        this.httpClient = this.options.httpClient;
        this.requestPolicyOptions = new RequestPolicyOptions(this.options.pipelineLogger);
    }

    /**
     * Send the provided HttpRequest request.
     * @param request The HTTP request to send.
     * @return A Promise that resolves to the HttpResponse from the targeted server.
     */
    public send(request: HttpRequest): Promise<HttpResponse> {
        let requestPolicyChainHead: RequestPolicy = this.httpClient;
        if (this.requestPolicyFactories) {
            const requestPolicyFactoriesLength: number = this.requestPolicyFactories.length;
            for (let i = requestPolicyFactoriesLength - 1; i >= 0; --i) {
                const requestPolicyFactory: RequestPolicyFactory = this.requestPolicyFactories[i];
                requestPolicyChainHead = requestPolicyFactory(requestPolicyChainHead, this.requestPolicyOptions);
            }
        }
        return requestPolicyChainHead.send(request);
    }
}