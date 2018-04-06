import { HttpResponse } from "../lib/httpResponse";
import { HttpRequest } from "../lib/httpRequest";
import { HttpHeaders, RawHttpHeaders } from "../lib/httpHeaders";
export declare class InMemoryHttpResponse implements HttpResponse {
    private _request;
    private _statusCode;
    private _bodyText;
    private readonly _headers;
    constructor(_request: HttpRequest, _statusCode: number, headers: HttpHeaders | RawHttpHeaders, _bodyText?: string | undefined);
    readonly request: HttpRequest;
    readonly statusCode: number;
    readonly headers: HttpHeaders;
    bodyAsText(): Promise<string | undefined>;
    bodyAsJson(): Promise<{} | any[] | undefined>;
}
