// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";
import { SerializationOptions, log } from "./serializationOptions";
import { PropertyPath } from "./propertyPath";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

export interface SequenceTypeSpec<TSerializedValue, TDeserializedValue> extends TypeSpec<TSerializedValue[], TDeserializedValue[]> {
  /**
   * The values that are allowed for this EnumTypeSpec.
   */
  elementSpec: TypeSpec<TSerializedValue, TDeserializedValue>;
}

/**
 * A type specification that describes how to validate and serialize a Sequence of elements.
 */
export function sequenceSpec<TSerializedElement, TDeserializedElement>(elementSpec: TypeSpec<TSerializedElement, TDeserializedElement>): SequenceTypeSpec<TSerializedElement, TDeserializedElement> {
  return {
    specType: `Sequence`,

    elementSpec: elementSpec,

    serialize(propertyPath: PropertyPath, value: TDeserializedElement[], options: SerializationOptions): TSerializedElement[] {
      let result: TSerializedElement[];
      if (!Array.isArray(value)) {
        if (options && options.serializationStrictTypeChecking) {
          const errorMessage: string = createValidationErrorMessage(propertyPath, value, "an Array");
          log(options, HttpPipelineLogLevel.ERROR, errorMessage);
          throw new Error(errorMessage);
        } else {
          log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "an Array"));
        }

        result = value;
      } else {
        result = [];
        for (let i = 0; i < value.length; i++) {
          result[i] = elementSpec.serialize(propertyPath.concat([i.toString()]), value[i], options);
        }
      }
      return result;
    },

    deserialize(propertyPath: PropertyPath, value: TSerializedElement[], options: SerializationOptions): TDeserializedElement[] {
      let result: TDeserializedElement[];
      if (!Array.isArray(value)) {
        if (options && options.deserializationStrictTypeChecking) {
          const errorMessage: string = createValidationErrorMessage(propertyPath, value, "an Array");
          log(options, HttpPipelineLogLevel.ERROR, errorMessage);
          throw new Error(errorMessage);
        } else {
          log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, "an Array"));
        }

        result = value;
      } else {
        result = [];
        for (let i = 0; i < value.length; i++) {
          result[i] = elementSpec.deserialize(propertyPath.concat([i.toString()]), value[i], options);
        }
      }
      return result;
    }
  };
}