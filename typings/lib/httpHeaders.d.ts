/**
 * An individual header within a HttpHeaders collection.
 */
export interface HttpHeader {
    /**
     * The name of the header.
     */
    name: string;
    /**
     * The value of the header.
     */
    value: string;
}
/**
 * A HttpHeaders collection represented as a simple JSON object.
 */
export declare type RawHttpHeaders = {
    [headerName: string]: string;
};
/**
 * A collection of HTTP header key/value pairs.
 */
export declare class HttpHeaders {
    private readonly _headersMap;
    constructor(rawHeaders?: RawHttpHeaders);
    /**
     * Set a header in this collection with the provided name and value. The name is
     * case-insensitive.
     * @param headerName The name of the header to set. This value is case-insensitive.
     * @param headerValue The value of the header to set.
     */
    set(headerName: string, headerValue: string | number): void;
    /**
     * Get the header value for the provided header name, or undefined if no header exists in this
     * collection with the provided name.
     * @param headerName The name of the header.
     */
    get(headerName: string): string | undefined;
    /**
     * Get the headers that are contained in this collection.
     */
    headers(): HttpHeader[];
    /**
     * Get the header names that are contained in this collection.
     */
    headerNames(): string[];
    /**
     * Get the header names that are contained in this collection.
     */
    headerValues(): string[];
    /**
     * Get the JSON object representation of this HTTP header collection.
     */
    toJson(): RawHttpHeaders;
}
