import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
/**
 * A HttpClient implementation that uses fetch to send HTTP requests.
 * @param request The request to send.
 */
export declare function fetchHttpClient(request: HttpRequest): Promise<HttpResponse>;
