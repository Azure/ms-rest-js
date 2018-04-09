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
    private readonly _httpClient: HttpClient;
    private readonly _requestPolicyOptions: RequestPolicyOptions;

    constructor(private readonly _requestPolicyFactories: RequestPolicyFactory[], private readonly _httpPipelineOptions: HttpPipelineOptions) {
        if (!this._httpPipelineOptions) {
            this._httpPipelineOptions = {};
        }

        if (!this._httpPipelineOptions.httpClient) {
            this._httpPipelineOptions.httpClient = getDefaultHttpClient();
        }

        this._httpClient = this._httpPipelineOptions.httpClient;
        this._requestPolicyOptions = new RequestPolicyOptions(this._httpPipelineOptions.pipelineLogger);
    }

    /**
     * Send the provided HttpRequest request.
     * @param request The HTTP request to send.
     * @return A Promise that resolves to the HttpResponse from the targeted server.
     */
    public send(request: HttpRequest): Promise<HttpResponse> {
        let requestPolicyChainHead: RequestPolicy = this._httpClient;
        if (this._requestPolicyFactories) {
            const requestPolicyFactoriesLength: number = this._requestPolicyFactories.length;
            for (let i = requestPolicyFactoriesLength - 1; i >= 0; --i) {
                const requestPolicyFactory: RequestPolicyFactory = this._requestPolicyFactories[i];
                requestPolicyChainHead = requestPolicyFactory(requestPolicyChainHead, this._requestPolicyOptions);
            }
        }
        return requestPolicyChainHead.send(request);
    }
}