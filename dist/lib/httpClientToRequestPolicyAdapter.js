"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An adapter type that adapts a HttpClient to look like a RequestPolicy.
 */
var HttpClientToRequestPolicyAdapter = /** @class */ (function () {
    function HttpClientToRequestPolicyAdapter(_httpClient) {
        this._httpClient = _httpClient;
    }
    HttpClientToRequestPolicyAdapter.prototype.send = function (request) {
        return this._httpClient(request);
    };
    return HttpClientToRequestPolicyAdapter;
}());
exports.HttpClientToRequestPolicyAdapter = HttpClientToRequestPolicyAdapter;
//# sourceMappingURL=httpClientToRequestPolicyAdapter.js.map