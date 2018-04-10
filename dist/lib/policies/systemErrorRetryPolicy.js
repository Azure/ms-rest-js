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
var exponentialRetryPolicy_1 = require("./exponentialRetryPolicy");
/**
 * Get a RequestPolicyFactory that creates SystemErrorRetryPolicies.
 * @param authenticationProvider The provider to use to sign requests.
 */
function systemErrorRetryPolicy(retryOptions) {
    return function (nextPolicy, options) {
        return new SystemErrorRetryPolicy(retryOptions || {}, nextPolicy, options);
    };
}
exports.systemErrorRetryPolicy = systemErrorRetryPolicy;
var SystemErrorRetryPolicy = /** @class */ (function (_super) {
    __extends(SystemErrorRetryPolicy, _super);
    function SystemErrorRetryPolicy(retryOptions, nextPolicy, options) {
        return _super.call(this, retryOptions, nextPolicy, options) || this;
    }
    /**
     * Get whether or not we should retry the request based on the provided response.
     * @param response The response to read to determine whether or not we should retry.
     */
    SystemErrorRetryPolicy.prototype.shouldRetry = function (details) {
        var result = true;
        if (details.responseError && details.responseError.code) {
            switch (details.responseError.code) {
                case "ETIMEDOUT":
                case "ESOCKETTIMEDOUT":
                case "ECONNREFUSED":
                case "ECONNRESET":
                case "ENOENT":
                    result = false;
                    break;
            }
        }
        return result;
    };
    return SystemErrorRetryPolicy;
}(exponentialRetryPolicy_1.ExponentialRetryPolicy));
//# sourceMappingURL=systemErrorRetryPolicy.js.map