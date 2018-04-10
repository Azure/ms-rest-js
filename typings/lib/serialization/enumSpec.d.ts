import { TypeSpec } from "./typeSpec";
/**
 * A type specification that describes how to validate and serialize an object.
 */
export declare function enumSpec<T>(enumName: string, allowedValues: T[]): TypeSpec<T>;
