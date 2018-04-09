"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var httpPipelineLogLevel_1 = require("../httpPipelineLogLevel");
var requestPolicy_1 = require("../requestPolicy");
/**
 * Get a RequestPolicyFactory that creates UserAgentRequestPolicies.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
function userAgentPolicy(userAgent) {
    return function (nextPolicy, options) {
        return new UserAgentPolicy(userAgent, nextPolicy, options);
    };
}
exports.userAgentPolicy = userAgentPolicy;
var UserAgentPolicy = /** @class */ (function (_super) {
    __extends(UserAgentPolicy, _super);
    function UserAgentPolicy(_userAgent, nextPolicy, options) {
        var _this = _super.call(this, nextPolicy, options) || this;
        _this._userAgent = _userAgent;
        return _this;
    }
    UserAgentPolicy.prototype.send = function (request) {
        if (this.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO)) {
            this.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO, "Set \"User-Agent\" header to \"" + this._userAgent + "\".");
        }
        request.headers.set("User-Agent", this._userAgent);
        return this._nextPolicy.send(request);
    };
    return UserAgentPolicy;
}(requestPolicy_1.BaseRequestPolicy));
//# sourceMappingURL=userAgentPolicy.js.map