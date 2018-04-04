"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
var HttpRequest = /** @class */ (function () {
    function HttpRequest(_httpMethod, _url, _headers, _body) {
        this._httpMethod = _httpMethod;
        this._url = _url;
        this._headers = _headers;
        this._body = _body;
    }
    Object.defineProperty(HttpRequest.prototype, "httpMethod", {
        /**
         * Get the HTTP method that this request will use.
         */
        get: function () {
            return this._httpMethod;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "url", {
        /**
        * Get the URL that this request will be sent to.
        */
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "headers", {
        /**
         * Get the HTTP headers that will be sent with this request.
         */
        get: function () {
            return this._headers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HttpRequest.prototype, "body", {
        /**
         * Get the body that will be sent with this request.
         */
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Get the details of the service's operation that this request will be sent for.
     */
    // public get operationDetails(): OperationDetails {
    //     return this._operationDetails;
    // }
    /**
     * Create a new HTTP GET request with the provided properties.
     * @param url The URL that the created GET request will be sent to.
     * @param headers The HTTP headers that will be sent with the created GET request.
     * @param operationDetails The details of the operation that this GET request is being sent for.
     */
    HttpRequest.get = function (url, headers) {
        return !url ? undefined : new HttpRequest("GET", url, headers);
    };
    return HttpRequest;
}());
exports.HttpRequest = HttpRequest;
//# sourceMappingURL=httpRequest.js.map