// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize an object.
 */
export default function sequenceSpec<T>(elementSpec: TypeSpec<T>): TypeSpec<T[]> {
  return {
    typeName: `Sequence<${elementSpec.typeName}>`,

    serialize(propertyPath: string[], value: any): T[] {
      if (!Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an Array"));
      }

      const serializedArray: T[] = [];
      for (let i = 0; i < value.length; i++) {
        serializedArray[i] = elementSpec.serialize(propertyPath.concat([i.toString()]), value[i]);
      }

      return serializedArray;
    }
  };
}