// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";
import { HttpPipelineLogger } from "../httpPipelineLogger";
import { CompositeType } from "./compositeSpec";
import { TypeSpec } from "./typeSpec";

/**
 * Options that can be passed to a serialize() function.
 */
export interface SerializationOptions {
  /**
   * The type of output that will be produced.
   */
  outputType?: SerializationOutputType;

  /**
   * Whether or not serialization will follow strict type-checking. If strict type-checking is used,
   * then an Error will be thrown if a value doesn't match the provided TypeSpec's expected types.
   */
  serializationStrictTypeChecking?: boolean;

  /**
   * Whether or not serialization will only allow properties on composite types that have been
   * specified in the composite type specification. If strict allowed properties is used, then an
   * Error will be thrown if a composite value has a property that isn't specified in its composite
   * type specification.
   */
  serializationStrictAllowedProperties?: boolean;

  /**
   * Whether or not serialization will enforce required properties on composite types. If strict
   * missing properties is used, then an Error will be thrown if a composite value doesn't have a
   * property that is marked as required in its composite type specification.
   */
  serializationStrictMissingProperties?: boolean;

  /**
   * Whether or not deserialization will follow strict type-checking. If strict type-checking is
   * used, then an Error will be thrown if a value doesn't match the provided TypeSpec's expected
   * types.
   */
  deserializationStrictTypeChecking?: boolean;

  /**
   * Whether or not deserialization will only allow properties on composite types that have been
   * specified in the composite type specification. If strict allowed properties is used, then an
   * Error will be thrown if a composite value has a property that isn't specified in its composite
   * type specification.
   */
  deserializationStrictAllowedProperties?: boolean;

  /**
   * Whether or not deserialization will enforce required properties on composite types. If strict
   * missing properties is used, then an Error will be thrown if a composite value doesn't have a
   * property that is marked as required in its composite type specification.
   */
  deserializationStrictMissingProperties?: boolean;

  /**
   * A dictionary of composite type specifications.
   */
  compositeSpecDictionary?: { [typeName: string]: TypeSpec<CompositeType, CompositeType> };

  /**
   * A logger that will log messages as serialization and deserialization occurs.
   */
  logger?: HttpPipelineLogger;
}

/**
 * The different types of output that can be produced by serialization.
 */
export enum SerializationOutputType {
  JSON,
  XML
}

/**
 * Get whether or not a log with the provided log level should be logged.
 * @param logLevel The log level of the log that will be logged.
 * @returns Whether or not a log with the provided log level should be logged.
 */
export function shouldLog(serializationOptions: SerializationOptions, logLevel: HttpPipelineLogLevel): boolean {
  const logger: HttpPipelineLogger | undefined = serializationOptions.logger;
  return logger != undefined &&
    logLevel !== HttpPipelineLogLevel.OFF &&
    logLevel <= logger.minimumLogLevel;
}

/**
 * Attempt to log the provided message to the provided logger. If no logger was provided or if
 * the log level does not meat the logger's threshold, then nothing will be logged.
 * @param logLevel The log level of this log.
 * @param message The message of this log.
 */
export function log(serializationOptions: SerializationOptions, logLevel: HttpPipelineLogLevel, message: string): void {
  const logger: HttpPipelineLogger | undefined = serializationOptions.logger;
  if (logger && shouldLog(serializationOptions, logLevel)) {
    logger.log(logLevel, message);
  }
}