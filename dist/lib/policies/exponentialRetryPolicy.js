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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var requestPolicy_1 = require("../requestPolicy");
var utils = require("../util/utils");
/**
 * Get a RequestPolicyFactory that creates ExponentialRetryPolicies.
 */
function exponentialRetryPolicy(retryOptions) {
    return function (nextPolicy, options) {
        return new ExponentialRetryPolicy(retryOptions || {}, nextPolicy, options);
    };
}
exports.exponentialRetryPolicy = exponentialRetryPolicy;
var ExponentialRetryPolicy = /** @class */ (function (_super) {
    __extends(ExponentialRetryPolicy, _super);
    function ExponentialRetryPolicy(retryOptions, nextPolicy, options) {
        var _this = _super.call(this, nextPolicy, options) || this;
        _this._maximumAttempts = retryOptions.maximumAttempts || 3;
        _this._initialRetryDelayInMilliseconds = retryOptions.initialRetryDelayInMilliseconds || 30 * 1000;
        _this._maximumRetryDelayInMilliseconds = retryOptions.maximumRetryIntervalInMilliseconds || 90 * 1000;
        _this._delayFunction = retryOptions.delayFunction || utils.delay;
        return _this;
    }
    ExponentialRetryPolicy.prototype.send = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var response, shouldAttempt, attemptNumber, attemptDelayInMilliseconds, responseError, statusCode, error_1, boundedRandomDelta, incrementDelta;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shouldAttempt = true;
                        attemptNumber = 0;
                        attemptDelayInMilliseconds = this._initialRetryDelayInMilliseconds;
                        _a.label = 1;
                    case 1:
                        if (!shouldAttempt) return [3 /*break*/, 8];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        ++attemptNumber;
                        return [4 /*yield*/, this._nextPolicy.send(request.clone())];
                    case 3:
                        response = _a.sent();
                        if (response) {
                            statusCode = response.statusCode;
                            if ((statusCode < 500 && statusCode !== 408) || statusCode === 501 || statusCode === 505) {
                                shouldAttempt = false;
                                responseError = undefined;
                            }
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        if (responseError) {
                            error_1.innerError = responseError;
                        }
                        responseError = error_1;
                        return [3 /*break*/, 5];
                    case 5:
                        shouldAttempt = shouldAttempt && attemptNumber < this._maximumAttempts;
                        if (!shouldAttempt) return [3 /*break*/, 7];
                        response = undefined;
                        if (attemptNumber >= 2) {
                            boundedRandomDelta = (attemptDelayInMilliseconds * 0.8) + Math.floor(Math.random() * attemptDelayInMilliseconds * 0.4);
                            incrementDelta = (Math.pow(2, attemptNumber) - 1) * boundedRandomDelta;
                            attemptDelayInMilliseconds = Math.min(attemptDelayInMilliseconds + incrementDelta, this._maximumRetryDelayInMilliseconds);
                        }
                        return [4 /*yield*/, this._delayFunction(attemptDelayInMilliseconds)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [3 /*break*/, 1];
                    case 8: return [2 /*return*/, response ? Promise.resolve(response) : Promise.reject(responseError)];
                }
            });
        });
    };
    return ExponentialRetryPolicy;
}(requestPolicy_1.BaseRequestPolicy));
//# sourceMappingURL=exponentialRetryPolicy.js.map