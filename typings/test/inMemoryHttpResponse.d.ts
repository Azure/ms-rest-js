import { HttpHeaders, RawHttpHeaders } from "../lib/httpHeaders";
import { HttpRequest } from "../lib/httpRequest";
import { HttpResponse } from "../lib/httpResponse";
export declare class InMemoryHttpResponse implements HttpResponse {
    private _request;
    private _statusCode;
    private _bodyText;
    private readonly _headers;
    constructor(_request: HttpRequest, _statusCode: number, headers: HttpHeaders | RawHttpHeaders, _bodyText?: string | undefined);
    readonly request: HttpRequest;
    readonly statusCode: number;
    readonly headers: HttpHeaders;
    textBody(): Promise<string | undefined>;
    deserializedBody(): Promise<{} | any[] | undefined>;
}
