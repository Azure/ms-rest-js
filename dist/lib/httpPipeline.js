"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var fetchHttpClient_1 = require("./fetchHttpClient");
var requestPolicyOptions_1 = require("./requestPolicyOptions");
var defaultHttpClient;
function getDefaultHttpClient() {
    if (!defaultHttpClient) {
        defaultHttpClient = new fetchHttpClient_1.FetchHttpClient();
    }
    return defaultHttpClient;
}
/**
 * A collection of RequestPolicies that will be applied to a HTTP request before it is sent and will
 * be applied to a HTTP response when it is received.
 */
var HttpPipeline = /** @class */ (function () {
    function HttpPipeline(_requestPolicyFactories, _httpPipelineOptions) {
        this._requestPolicyFactories = _requestPolicyFactories;
        this._httpPipelineOptions = _httpPipelineOptions;
        if (!this._httpPipelineOptions) {
            this._httpPipelineOptions = {};
        }
        if (!this._httpPipelineOptions.httpClient) {
            this._httpPipelineOptions.httpClient = getDefaultHttpClient();
        }
        this._httpClient = this._httpPipelineOptions.httpClient;
        this._requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(this._httpPipelineOptions.pipelineLogger);
    }
    /**
     * Send the provided HttpRequest request.
     * @param request The HTTP request to send.
     * @return A Promise that resolves to the HttpResponse from the targeted server.
     */
    HttpPipeline.prototype.send = function (request) {
        var requestPolicyChainHead = this._httpClient;
        if (this._requestPolicyFactories) {
            var requestPolicyFactoriesLength = this._requestPolicyFactories.length;
            for (var i = requestPolicyFactoriesLength - 1; i >= 0; --i) {
                var requestPolicyFactory = this._requestPolicyFactories[i];
                requestPolicyChainHead = requestPolicyFactory(requestPolicyChainHead, this._requestPolicyOptions);
            }
        }
        return requestPolicyChainHead.send(request);
    };
    return HttpPipeline;
}());
exports.HttpPipeline = HttpPipeline;
//# sourceMappingURL=httpPipeline.js.map