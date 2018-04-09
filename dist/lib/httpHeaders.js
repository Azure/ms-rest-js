"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A collection of HttpHeaders that can be sent with a HTTP request.
 */
function getHeaderKey(headerName) {
    return headerName.toLowerCase();
}
/**
 * A collection of HTTP header key/value pairs.
 */
var HttpHeaders = /** @class */ (function () {
    function HttpHeaders(rawHeaders) {
        this._headersMap = {};
        if (rawHeaders) {
            for (var headerName in rawHeaders) {
                this.set(headerName, rawHeaders[headerName]);
            }
        }
    }
    /**
     * Set a header in this collection with the provided name and value. The name is
     * case-insensitive.
     * @param headerName The name of the header to set. This value is case-insensitive.
     * @param headerValue The value of the header to set.
     */
    HttpHeaders.prototype.set = function (headerName, headerValue) {
        this._headersMap[getHeaderKey(headerName)] = { name: headerName, value: headerValue.toString() };
    };
    /**
     * Get the header value for the provided header name, or undefined if no header exists in this
     * collection with the provided name.
     * @param headerName The name of the header.
     */
    HttpHeaders.prototype.get = function (headerName) {
        var header = this._headersMap[getHeaderKey(headerName)];
        return !header ? undefined : header.value;
    };
    /**
     * Get the headers that are contained this collection as an object.
     */
    HttpHeaders.prototype.rawHeaders = function () {
        var result = {};
        for (var headerKey in this._headersMap) {
            var header = this._headersMap[headerKey];
            result[header.name] = header.value;
        }
        return result;
    };
    /**
     * Get the headers that are contained in this collection as an array.
     */
    HttpHeaders.prototype.headersArray = function () {
        var headers = [];
        for (var headerKey in this._headersMap) {
            headers.push(this._headersMap[headerKey]);
        }
        return headers;
    };
    /**
     * Get the header names that are contained in this collection.
     */
    HttpHeaders.prototype.headerNames = function () {
        var headerNames = [];
        var headers = this.headersArray();
        for (var i = 0; i < headers.length; ++i) {
            headerNames.push(headers[i].name);
        }
        return headerNames;
    };
    /**
     * Get the header names that are contained in this collection.
     */
    HttpHeaders.prototype.headerValues = function () {
        var headerValues = [];
        var headers = this.headersArray();
        for (var i = 0; i < headers.length; ++i) {
            headerValues.push(headers[i].value);
        }
        return headerValues;
    };
    /**
     * Get the JSON object representation of this HTTP header collection.
     */
    HttpHeaders.prototype.toJson = function () {
        var result = {};
        var headers = this.headersArray();
        for (var i = 0; i < headers.length; ++i) {
            result[headers[i].name] = headers[i].value;
        }
        return result;
    };
    /**
     * Create a deep clone/copy of this HttpHeaders collection.
     */
    HttpHeaders.prototype.clone = function () {
        return new HttpHeaders(this.rawHeaders());
    };
    return HttpHeaders;
}());
exports.HttpHeaders = HttpHeaders;
//# sourceMappingURL=httpHeaders.js.map