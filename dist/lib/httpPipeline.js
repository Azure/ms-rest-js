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
    function HttpPipeline(requestPolicyFactories, options) {
        this.requestPolicyFactories = requestPolicyFactories;
        this.options = options;
        if (!this.options) {
            this.options = {};
        }
        if (!this.options.httpClient) {
            this.options.httpClient = getDefaultHttpClient();
        }
        this.httpClient = this.options.httpClient;
        this.requestPolicyOptions = new requestPolicyOptions_1.RequestPolicyOptions(this.options.pipelineLogger);
    }
    /**
     * Send the provided HttpRequest request.
     * @param request The HTTP request to send.
     * @return A Promise that resolves to the HttpResponse from the targeted server.
     */
    HttpPipeline.prototype.send = function (request) {
        var requestPolicyChainHead = this.httpClient;
        if (this.requestPolicyFactories) {
            var requestPolicyFactoriesLength = this.requestPolicyFactories.length;
            for (var i = requestPolicyFactoriesLength - 1; i >= 0; --i) {
                var requestPolicyFactory = this.requestPolicyFactories[i];
                requestPolicyChainHead = requestPolicyFactory(requestPolicyChainHead, this.requestPolicyOptions);
            }
        }
        return requestPolicyChainHead.send(request);
    };
    return HttpPipeline;
}());
exports.HttpPipeline = HttpPipeline;
//# sourceMappingURL=httpPipeline.js.map