// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec } from "./typeSpec";
import { CompositeType } from "./compositeSpec";

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
}

/**
 * The different types of output that can be produced by serialization.
 */
export enum SerializationOutputType {
  JSON,
  XML
}