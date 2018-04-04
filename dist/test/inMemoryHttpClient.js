"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A simple HttpClient implementation that uses a provided function to respond to HttpRequests.
 */
var InMemoryHttpClient = /** @class */ (function () {
    function InMemoryHttpClient(_requestHandler) {
        this._requestHandler = _requestHandler;
    }
    InMemoryHttpClient.prototype.send = function (request) {
        return this._requestHandler(request);
    };
    return InMemoryHttpClient;
}());
exports.InMemoryHttpClient = InMemoryHttpClient;
//# sourceMappingURL=inMemoryHttpClient.js.map