// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";
import { HttpPipelineLogger } from "../httpPipelineLogger";
import { CompositeType } from "./compositeSpec";
import { PropertyPath } from "./propertyPath";
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

export function failSerializeTypeCheck(options: SerializationOptions, propertyPath: PropertyPath, value: any, expectedTypeDescription: string): void {
  failTypeCheck(options && options.serializationStrictTypeChecking ? true : false, options, propertyPath, value, expectedTypeDescription);
}

export function failDeserializeTypeCheck(options: SerializationOptions, propertyPath: PropertyPath, value: any, expectedTypeDescription: string): void {
  failTypeCheck(options && options.deserializationStrictTypeChecking ? true : false, options, propertyPath, value, expectedTypeDescription);
}

/**
 * Log (and possibly throw an Error) when a value failed to pass its type-checking validation.
 * @param isTypeCheckingStrict Whether or not type-checking is strict.
 * @param options The serialization options.
 * @param propertyPath The path to the property that is being serialized or deserialized.
 * @param value The value that is being serialized or deserialized.
 * @param expectedTypeDescription The description of the type that the value is expected to be.
 */
function failTypeCheck(isTypeCheckingStrict: boolean, options: SerializationOptions, propertyPath: PropertyPath, value: any, expectedTypeDescription: string): void {
  if (isTypeCheckingStrict) {
    throw logAndCreateError(options, `Property ${propertyPath} with value ${JSON.stringify(value)} must be ${expectedTypeDescription}.`);
  } else {
    log(options, HttpPipelineLogLevel.WARNING, `Property ${propertyPath} with value ${JSON.stringify(value)} should be ${expectedTypeDescription}.`);
  }
}

export function failSerializeMissingRequiredPropertyCheck(options: SerializationOptions, childPropertyPath: PropertyPath, childPropertyValueSpec: TypeSpec<any, any>): void {
  failMissingRequiredPropertyCheck(options && options.serializationStrictMissingProperties ? true : false, options, childPropertyPath, childPropertyValueSpec);
}

export function failDeserializeMissingRequiredPropertyCheck(options: SerializationOptions, childPropertyPath: PropertyPath, childPropertyValueSpec: TypeSpec<any, any>): void {
  failMissingRequiredPropertyCheck(options && options.deserializationStrictMissingProperties ? true : false, options, childPropertyPath, childPropertyValueSpec);
}

function failMissingRequiredPropertyCheck(isMissingRequiredPropertyCheckingStrict: boolean, options: SerializationOptions, childPropertyPath: PropertyPath, childPropertyValueSpec: TypeSpec<any, any>): void {
  const message = `Missing non-constant ${childPropertyValueSpec.specType} property at ${childPropertyPath}.`;
  if (isMissingRequiredPropertyCheckingStrict) {
    throw logAndCreateError(options, message);
  } else {
    log(options, HttpPipelineLogLevel.WARNING, message);
  }
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

/**
 * Log the provided error message and throw an error with the error message inside.
 * @param serializationOptions The serializationOptions to use to log the provided error message.
 * @param errorMessage The error message to log and throw inside of an Error.
 */
export function logAndCreateError(serializationOptions: SerializationOptions, errorMessage: string): Error {
  log(serializationOptions, HttpPipelineLogLevel.ERROR, errorMessage);
  return new Error(errorMessage);
}

export function resolveValueSpec<TSerialized, TDeserialized>(serializationOptions: SerializationOptions, path: PropertyPath, valueSpec: TypeSpec<TSerialized, TDeserialized> | string): TypeSpec<TSerialized, TDeserialized> {
  let result: TypeSpec<TSerialized, TDeserialized>;
  if (typeof valueSpec === "string") {
    if (!serializationOptions.compositeSpecDictionary || !serializationOptions.compositeSpecDictionary[valueSpec]) {
      throw logAndCreateError(serializationOptions, `Missing composite specification entry in composite type dictionary for type named "${valueSpec}" at ${path}.`);
    }
    result = serializationOptions.compositeSpecDictionary[valueSpec] as TypeSpec<TSerialized, TDeserialized>;
  } else {
    result = valueSpec;
  }
  return result;
}