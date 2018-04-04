import { HttpResponse } from "../lib/httpResponse";
import { HttpRequest } from "../lib/httpRequest";
import { HttpHeaders } from "../lib/httpHeaders";
export declare class InMemoryHttpResponse implements HttpResponse {
    private _request;
    private _statusCode;
    private _headers;
    private _bodyText;
    constructor(_request: HttpRequest, _statusCode: number, _headers: HttpHeaders, _bodyText?: string | undefined);
    readonly request: HttpRequest;
    readonly statusCode: number;
    readonly headers: HttpHeaders;
    bodyAsText(): Promise<string | undefined>;
    bodyAsJson(): Promise<{} | any[] | undefined>;
}
