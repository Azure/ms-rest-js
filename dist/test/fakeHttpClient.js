"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A function that can send HttpRequests and receive promised HttpResponses.
 * @param request The HTTP request to send.
 * @returns A Promise that resolves to the HttpResponse from the targeted server.
 */
var FakeHttpClient = /** @class */ (function () {
    function FakeHttpClient(sendFunction) {
        this.sendFunction = sendFunction;
    }
    /**
     * Send the provided HttpRequest and return a Promise that resolves to the HttpResponse from the
     * targeted server.
     * @param request The HttpRequest to send.
     */
    FakeHttpClient.prototype.send = function (request) {
        return this.sendFunction(request);
    };
    return FakeHttpClient;
}());
exports.FakeHttpClient = FakeHttpClient;
//# sourceMappingURL=fakeHttpClient.js.map