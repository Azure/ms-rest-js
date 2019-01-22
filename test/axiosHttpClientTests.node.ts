// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import rewire from "rewire";
import "chai/register-should";
import { should } from "chai";
import { ProxySettings } from "../lib/serviceClient";
import { AxiosProxyConfig } from "axios";
import { WebResource } from "../lib/msRest";
import { AxiosHttpClient } from "../lib/axiosHttpClient";

describe("AxiosHttpClient", () => {
    describe("sendRequest", () => {
        it.only("should", async () => {
            const request = new WebResource("https://microsoft.com");
            const axiosHttpClient = new AxiosHttpClient();
            await axiosHttpClient.sendRequest(request);
        });
    });

    describe("convertToAxiosProxyConfig", () => {
        const axiosHttpClient = rewire("../lib/axiosHttpClient");
        const convertToAxiosProxyConfig: (proxySettings: ProxySettings | undefined) => AxiosProxyConfig | undefined = axiosHttpClient.__get__("convertToAxiosProxyConfig");

        const defaultHost = "https://proxy.microsoft.com";
        const defaultPort = 80;

        it("should return undefined config when undefined settings passed", () => {
            const config = convertToAxiosProxyConfig(undefined);
            should().not.exist(config);
        });

        it("should return basic config when required settings passed", () => {
            const settings: ProxySettings = {
                host: defaultHost,
                port: defaultPort
            };

            const config = convertToAxiosProxyConfig(settings)!;

            config.host.should.equal(defaultHost);
            config.port.should.equal(defaultPort);
            should().not.exist(config.auth);
        });

        it("should correctly transform auth data", () => {
            const username = "login";
            const password = "secret_password";
            const settings: ProxySettings = {
                host: defaultHost,
                port: defaultPort,
                username: username,
                password: password
            };

            const config = convertToAxiosProxyConfig(settings)!;

            config.auth!.username.should.equal(username);
            config.auth!.password.should.equal(password);
        });
    });
});
