"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var httpHeaders_1 = require("./httpHeaders");
/**
 * An individual HTTP request that can be sent with a HttpClient.
 */
var HttpRequest = /** @class */ (function () {
    /**
     * Create a new HTTP request using the provided properties.
     * @param httpMethod The HTTP method that will be used to send this request.
     * @param url The URL that this request will be sent to.
     * @param headers The HTTP headers to include in this request.
     * @param _body The body of this HTTP request.
     */
    function HttpRequest(httpMethod, url, headers, _body) {
        this.httpMethod = httpMethod;
        this.url = url;
        this._body = _body;
        if (!this.url) {
            var urlString = (this.url == undefined ? this.url : "\"" + this.url + "\"");
            throw new Error(urlString + " is not a valid URL for a HttpRequest.");
        }
        this._headers = (headers instanceof httpHeaders_1.HttpHeaders ? headers : new httpHeaders_1.HttpHeaders(headers));
    }
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
     * Create a deep clone/copy of this HttpRequest.
     */
    HttpRequest.prototype.clone = function () {
        return new HttpRequest(this.httpMethod, this.url, this.headers.clone(), this.body);
    };
    return HttpRequest;
}());
exports.HttpRequest = HttpRequest;
//# sourceMappingURL=httpRequest.js.map