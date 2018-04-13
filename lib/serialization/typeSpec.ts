// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { SerializationOptions } from "./serializationOptions";
import { SpecPath } from "./specPath";

/**
 * A type specification that describes how to validate and serialize an object of a given type.
 */
export interface TypeSpec<TSerialized, TDeserialized> {
  /**
   * The name of the type that this TypeSpec validates.
   */
  specType: string;

  /**
   * Validate and serialize the provided value into the return type TSerialized.
   * @param propertyPath The path from the root of the type being serialized down to this
   * property.
   * @param value The value to validate and serialize.
   * @param options The options that indicate how the value is to be serialized and validated.
   */
  serialize(propertyPath: SpecPath, value: TDeserialized, options: SerializationOptions): TSerialized;

  /**
   * Validate and deserialize the provided value into the return type TDeserialized.
   * @param propertyPath The path from the root of the type being deserialized down to this
   * property.
   * @param value The value to validate and deserialize.
   * @param options The options that indicate how the value is to be deserialized and validated.
   */
  deserialize(propertyPath: SpecPath, value: TSerialized, options: SerializationOptions): TDeserialized;
}

/**
 * Create an error message for an invalid serialization.
 * @param propertyPath The path to the property with the serialization error.
 * @param value The value that failed the serialization.
 * @param expectedConditionDescription A brief description of what type was expected.
 */
export function createValidationErrorMessage(propertyPath: SpecPath, value: any, expectedConditionDescription: string): string {
  return `Property ${propertyPath} with value ${JSON.stringify(value)} must be ${expectedConditionDescription}.`;
}