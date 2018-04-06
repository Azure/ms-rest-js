"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
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
var requestPolicy_1 = require("../requestPolicy");
var httpPipelineLogLevel_1 = require("../httpPipelineLogLevel");
/**
 * Get a RequestPolicyFactory that creates UserAgentRequestPolicies.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
function userAgentRequestPolicyFactory(userAgent) {
    return function (nextPolicy, options) {
        return new UserAgentRequestPolicy(userAgent, nextPolicy, options);
    };
}
exports.userAgentRequestPolicyFactory = userAgentRequestPolicyFactory;
var UserAgentRequestPolicy = /** @class */ (function (_super) {
    __extends(UserAgentRequestPolicy, _super);
    function UserAgentRequestPolicy(_userAgent, nextPolicy, options) {
        var _this = _super.call(this, nextPolicy, options) || this;
        _this._userAgent = _userAgent;
        return _this;
    }
    UserAgentRequestPolicy.prototype.send = function (request) {
        if (this.shouldLog(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO)) {
            this.log(httpPipelineLogLevel_1.HttpPipelineLogLevel.INFO, "Set \"User-Agent\" header to \"" + this._userAgent + "\".");
        }
        request.headers.set("User-Agent", this._userAgent);
        return this.nextPolicy.send(request);
    };
    return UserAgentRequestPolicy;
}(requestPolicy_1.BaseRequestPolicy));
//# sourceMappingURL=userAgentRequestPolicyFactory.js.map