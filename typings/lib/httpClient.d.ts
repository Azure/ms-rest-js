import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
/**
 * A function that can send HttpRequests and receive promised HttpResponses.
 * @param request The HTTP request to send.
 * @returns A Promise that resolves to the HttpResponse from the targeted server.
 */
export declare type HttpClient = (request: HttpRequest) => Promise<HttpResponse>;
