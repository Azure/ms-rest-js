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
     *
     * @param httpMethod The HTTP method that this request will use.
     * @param url The URL that this request will be sent to.
     * @param headers The HTTP headers that will be sent with this request.
     * @param body The body that will be sent with this request.
     */
    function HttpRequest(httpMethod, url, headers, body) {
        this.httpMethod = httpMethod;
        this.url = url;
        this.body = body;
        if (!this.url) {
            var urlString = (this.url === undefined || this.url === null ? this.url : "\"" + this.url + "\"");
            throw new Error(urlString + " is not a valid URL for a HttpRequest.");
        }
        this.headers = (headers instanceof httpHeaders_1.HttpHeaders ? headers : new httpHeaders_1.HttpHeaders(headers));
    }
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