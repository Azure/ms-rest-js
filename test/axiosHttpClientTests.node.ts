// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import "chai/register-should";
import { should } from "chai";
import MockAdapter from "axios-mock-adapter";
import tunnel from "tunnel";
import http from "http";
import https from "https";
import axios from "axios";
import net from "net";
// import httpProxy from "http-proxy";

import { WebResource, HttpHeaders } from "../lib/msRest";
import { AxiosHttpClient, createTunnel, createProxyAgent } from "../lib/axiosHttpClient";
import { ProxySettings } from "../lib/serviceClient";

describe("AxiosHttpClient", () => {
    describe("sendRequest", () => {
        describe("proxy", () => {
            const httpPort = 901;
            const url = `http://localhost:${httpPort}`;
            const defaultProxySettings = {
                host: "localhost",
                port: 886
            };

            function createWebResource(proxySettings?: ProxySettings | boolean): WebResource {
                const request = new WebResource(url, "GET");

                if (proxySettings) {
                    if (typeof proxySettings === "object") {
                        request.proxySettings = proxySettings;
                    } else {
                        request.proxySettings = defaultProxySettings;
                    }
                }

                return request;
            }

            let mock: MockAdapter;
            before(() => {
                mock = new MockAdapter(axios);
            });

            beforeEach(() => mock.restore());
            afterEach(() => mock.reset());

            [true, undefined].forEach(value => {
                it(`axios proxy should be turned off when proxy settings ${value ? "" : "not "}passed`, async () => {
                    try {
                        const request = createWebResource(value);
                        const axiosHttpClient = new AxiosHttpClient();
                        const response = await axiosHttpClient.sendRequest(request);
                        console.log("RESULT:\n" + JSON.stringify(response), undefined, "  ");
                        response.status.should.equal(234);

                    } finally {

                    }
                });
            });

            it.only("foo", async () => {
                let proxyServer: net.Server | undefined = undefined;
                let httpServer: http.Server | undefined = undefined;
                try {
                    proxyServer = net.createServer(socket => {
                        socket.on("data", message => {
                            console.log("---PROXY- got message", message.toString());

                            const serviceSocket = new net.Socket();

                            serviceSocket.connect(8001, "localhost", () => {
                                console.log("---PROXY- Sending message to server");
                                serviceSocket.write(message);
                            });

                            serviceSocket.on("data", data => {
                                console.log("---PROXY- Receiving message from server", data.toString());
                                socket.write(data);
                            });
                        });
                    });

                    httpServer = http.createServer(function (req, res) {
                        console.log(`PREQ: ${JSON.stringify(req.url, undefined, "  ")}`);
                        console.log(`PRES: ${JSON.stringify(req.headers, undefined, "  ")}`);
                        res.writeHead(200, { "Content-Type": "text/plain" });
                        res.write("request successfully proxied to: " + req.url + "\n" + JSON.stringify(req.headers, undefined, 2));
                        res.end();
                    });

                    proxyServer.listen(8001);
                    httpServer.listen(8000);

                    const request = new WebResource();
                    request.url = "http://localhost:8000";
                    request.proxySettings = {
                        host: "localhost",
                        port: 8001
                    };

                    const axiosHttpClient = new AxiosHttpClient();
                    const response = await axiosHttpClient.sendRequest(request);

                    console.log("RESULT:\n" + JSON.stringify(response), undefined, "  ");
                } finally {
                    proxyServer!.close();
                    httpServer!.close();
                }
            });

            it("should set HTTP agent for HTTP proxy", async () => {
                mock.onGet(url).reply(config => {
                    console.log(config, undefined, "  ");
                    config.httpAgent.should.exist;
                    should().not.exist(config.httpsAgent);
                    console.log(config.httpAgent, undefined, "  ");
                    return [235];
                });

                const request = createWebResource(true);
                const axiosHttpClient = new AxiosHttpClient();
                const response = await axiosHttpClient.sendRequest(request);
                response.status.should.equal(235);
            });

            it("foo", async () => {
                const axios = require("axios");
                const b = axios.create();

                await b.get("http://example.com", {
                    proxy: false,
                    httpAgent: tunnel.httpOverHttp({
                        proxy: {
                            host: "localhost",
                            port: 8888,
                            headers: {}
                        }
                    })
                });

            });
        });
    });

    describe("createProxyAgent", () => {
        type HttpsAgent = https.Agent & {
            defaultPort: number | undefined,
            options: {
                proxy: tunnel.ProxyOptions
            },
            proxyOptions: tunnel.ProxyOptions
        };

        [
            { proxy: "http", request: "ftp", port: undefined, isProxyHttps: false },
            { proxy: "http", request: "http", port: undefined, isProxyHttps: false },
            { proxy: "hTtp", request: "https", port: 443, isProxyHttps: true },
            { proxy: "HTTPS", request: "http", port: undefined, isProxyHttps: false },
            { proxy: "https", request: "hTTps", port: 443, isProxyHttps: true }
        ].forEach(testCase => {
            it(`should return ${testCase.isProxyHttps ? "HTTPS" : "HTTP"} proxy for ${testCase.proxy.toUpperCase()} proxy server and ${testCase.request.toUpperCase()} request`, function (done) {
                const proxySettings = {
                    host: `${testCase.proxy}://proxy.microsoft.com`,
                    port: 8080
                };
                const requestUrl = `${testCase.request}://example.com`;

                const proxyAgent = createProxyAgent(requestUrl, proxySettings);

                proxyAgent.isHttps.should.equal(testCase.isProxyHttps);
                const agent = proxyAgent.agent as HttpsAgent;
                should().equal(agent.defaultPort, testCase.port);
                agent.options.proxy.host!.should.equal(proxySettings.host);
                agent.options.proxy.port!.should.equal(proxySettings.port);
                done();
            });
        });

        it("should copy headers correctly", function (done) {
            const proxySettings = {
                host: "http://proxy.microsoft.com",
                port: 8080
            };
            const headers = new HttpHeaders({
                "User-Agent": "Node.js"
            });

            const proxyAgent = createProxyAgent("http://example.com", proxySettings, headers);

            const agent = proxyAgent.agent as HttpsAgent;
            agent.proxyOptions.headers.should.contain({ "user-agent": "Node.js" });
            done();
        });
    });

    describe("createTunnel", () => {
        const defaultProxySettings = {
            host: "http://proxy.microsoft.com",
            port: 8080
        };

        type HttpsAgent = https.Agent & {
            defaultPort: number | undefined,
            options: {
                proxy: tunnel.ProxyOptions
            }
        };

        [true, false].forEach(value => {
            it(`returns HTTP agent for HTTP request and HTTP${value ? "S" : ""} proxy`, function () {
                const tunnelConfig: tunnel.HttpsOverHttpsOptions = {
                    proxy: {
                        host: defaultProxySettings.host,
                        port: defaultProxySettings.port,
                        headers: {}
                    }
                };

                const tunnel = createTunnel(false, value, tunnelConfig) as HttpsAgent;
                tunnel.options.proxy.host!.should.equal(defaultProxySettings.host);
                tunnel.options.proxy.port!.should.equal(defaultProxySettings.port);
                should().not.exist(tunnel.defaultPort);
            });
        });

        [true, false].forEach(value => {
            it(`returns HTTPS agent for HTTPS request and HTTP${value ? "S" : ""} proxy`, function () {
                const tunnelConfig: tunnel.HttpsOverHttpsOptions = {
                    proxy: {
                        host: defaultProxySettings.host,
                        port: defaultProxySettings.port,
                        headers: {}
                    }
                };

                const tunnel = createTunnel(true, value, tunnelConfig) as HttpsAgent;
                tunnel.options.proxy.host!.should.equal(defaultProxySettings.host);
                tunnel.options.proxy.port!.should.equal(defaultProxySettings.port);
                tunnel.defaultPort!.should.equal(443);
            });
        });
    });
});
