// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SerializationOptions } from "./serializationOptions";
import { SpecPath } from "./specPath";

export interface SequenceTypeSpec<TSerializedValue, TDeserializedValue> extends TypeSpec<TSerializedValue[], TDeserializedValue[]> {
  /**
   * The values that are allowed for this EnumTypeSpec.
   */
  elementSpec: TypeSpec<TSerializedValue, TDeserializedValue>;
}

/**
 * A type specification that describes how to validate and serialize a Sequence of elements.
 */
export default function sequenceSpec<TSerializedElement, TDeserializedElement>(elementSpec: TypeSpec<TSerializedElement, TDeserializedElement>): SequenceTypeSpec<TSerializedElement, TDeserializedElement> {
  return {
    specType: `Sequence`,

    elementSpec: elementSpec,

    serialize(propertyPath: SpecPath, value: TDeserializedElement[], options: SerializationOptions): TSerializedElement[] {
      if (!Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an Array"));
      }

      const serializedArray: TSerializedElement[] = [];
      for (let i = 0; i < value.length; i++) {
        serializedArray[i] = elementSpec.serialize(propertyPath.concat([i.toString()]), value[i], options);
      }

      return serializedArray;
    },

    deserialize(propertyPath: SpecPath, value: TSerializedElement[], options: SerializationOptions): TDeserializedElement[] {
      if (!Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an Array"));
      }

      const deserializedArray: TDeserializedElement[] = [];
      for (let i = 0; i < value.length; i++) {
        deserializedArray[i] = elementSpec.deserialize(propertyPath.concat([i.toString()]), value[i], options);
      }

      return deserializedArray;
    }
  };
}