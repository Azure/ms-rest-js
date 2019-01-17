// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import mock, { proxy } from "xhr-mock";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

interface MockHttpFacade {
    setup(): void;
    teardown(): void;
    get(url: string | RegExp): void;
}

export class ProxyMockHttp implements MockHttpFacade {
    private _browserMockHttp: BrowserMockHttp = new BrowserMockHttp();
    private _nodeMockHttp: NodeMockHttp = new NodeMockHttp();

    public setup(): void {

    }

    teardown(): void {
        throw new Error("Method not implemented.");
    }
}

class NodeMockHttp implements MockHttpFacade {
    private _mockAdapter: MockAdapter = new MockAdapter(axios);

    setup(): void {
    }

    teardown(): void {
        this._mockAdapter.restore();
    }

    get(url: string | RegExp): void {
        this._mockAdapter.onGet(url, )
    }
}

class BrowserMockHttp implements MockHttpFacade {
    setup(): void {
        mock.setup();
    }

    teardown(): void {
        mock.teardown();
    }

    get(url: string | RegExp): void {
        mock.get(url, 
    }
}

