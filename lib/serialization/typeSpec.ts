// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { SerializationOptions } from "./serializationOptions";

/**
 * A type specification that describes how to validate and serialize an object of a given type.
 */
export interface TypeSpec<TSerialized> {
  /**
   * The name of the type that this TypeSpec validates.
   */
  typeName: string;

  /**
   * The values that are allowed for this TypeSpec. If this is undefined, then all values of the
   * correct type are valid.
   */
  allowedValues?: TSerialized[];

  /**
   * Validate and serialize the provided value into the return type T.
   * @param propertyPath The path from the root of the type being serialized down to this
   * property.
   * @param value The value to validate and serialize.
   */
  serialize(propertyPath: string[], value: any, options: SerializationOptions): TSerialized;
}

/**
 * Create an error message for an invalid serialization.
 * @param propertyPath The path to the property with the serialization error.
 * @param value The value that failed the serialization.
 * @param expectedConditionDescription A brief description of what type was expected.
 */
export function createValidationErrorMessage(propertyPath: string[], value: any, expectedConditionDescription: string): string {
  return `Property ${propertyPath.join(".")} with value ${JSON.stringify(value)} must be ${expectedConditionDescription}.`;
}