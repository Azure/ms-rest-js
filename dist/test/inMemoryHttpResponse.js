"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
var InMemoryHttpResponse = /** @class */ (function () {
    function InMemoryHttpResponse(_request, _statusCode, _headers, _bodyText) {
        this._request = _request;
        this._statusCode = _statusCode;
        this._headers = _headers;
        this._bodyText = _bodyText;
    }
    Object.defineProperty(InMemoryHttpResponse.prototype, "request", {
        get: function () {
            return this._request;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InMemoryHttpResponse.prototype, "statusCode", {
        get: function () {
            return this._statusCode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InMemoryHttpResponse.prototype, "headers", {
        get: function () {
            return this._headers;
        },
        enumerable: true,
        configurable: true
    });
    InMemoryHttpResponse.prototype.bodyAsText = function () {
        return Promise.resolve(this._bodyText);
    };
    InMemoryHttpResponse.prototype.bodyAsJson = function () {
        return Promise.resolve(this._bodyText ? JSON.parse(this._bodyText) : undefined);
    };
    return InMemoryHttpResponse;
}());
exports.InMemoryHttpResponse = InMemoryHttpResponse;
//# sourceMappingURL=inMemoryHttpResponse.js.map