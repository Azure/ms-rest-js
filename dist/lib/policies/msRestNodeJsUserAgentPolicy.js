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
var os = require("os");
var requestPolicy_1 = require("../requestPolicy");
var constants_1 = require("../util/constants");
/**
 * Get a RequestPolicyFactory that creates adds the ms-rest user agent to outgoing requests.
 * @param userAgent The userAgent string to apply to each outgoing request.
 */
function msRestNodeJsUserAgentPolicy(userAgentInfo) {
    return function (nextPolicy, options) {
        return new MsRestNodeJsUserAgentPolicy(userAgentInfo, nextPolicy, options);
    };
}
exports.msRestNodeJsUserAgentPolicy = msRestNodeJsUserAgentPolicy;
var MsRestNodeJsUserAgentPolicy = /** @class */ (function (_super) {
    __extends(MsRestNodeJsUserAgentPolicy, _super);
    function MsRestNodeJsUserAgentPolicy(_userAgentInfo, nextPolicy, options) {
        var _this = _super.call(this, nextPolicy, options) || this;
        _this._userAgentInfo = _userAgentInfo;
        return _this;
    }
    MsRestNodeJsUserAgentPolicy.prototype.send = function (request) {
        if (!request.headers.get(constants_1.Constants.HeaderConstants.USER_AGENT)) {
            var osInfo = "(" + os.arch() + "-" + os.type() + "-" + os.release() + ")";
            if (this._userAgentInfo.indexOf(osInfo) === -1) {
                this._userAgentInfo.unshift(osInfo);
            }
            var runtimeInfo = "Node/" + process.version;
            if (this._userAgentInfo.indexOf(runtimeInfo) === -1) {
                this._userAgentInfo.unshift(runtimeInfo);
            }
            var nodeSDKSignature = "Azure-SDK-For-Node";
            if (this._userAgentInfo.indexOf(nodeSDKSignature) === -1) {
                var azureRuntime = "ms-rest-azure";
                var insertIndex = this._userAgentInfo.indexOf(azureRuntime);
                // insert after azureRuntime, otherwise, insert last.
                insertIndex = insertIndex < 0 ? this._userAgentInfo.length : insertIndex + 1;
                this._userAgentInfo.splice(insertIndex, 0, nodeSDKSignature);
            }
            request.headers.set(constants_1.Constants.HeaderConstants.USER_AGENT, this._userAgentInfo.join(" "));
        }
        return this._nextPolicy.send(request);
    };
    return MsRestNodeJsUserAgentPolicy;
}(requestPolicy_1.BaseRequestPolicy));
//# sourceMappingURL=msRestNodeJsUserAgentPolicy.js.map