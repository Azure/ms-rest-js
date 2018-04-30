// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck, resolveTypeSpec, SerializationOutputType } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

export interface SequenceTypeSpec<TSerializedElement, TDeserializedElement> extends TypeSpec<TSerializedElement[], TDeserializedElement[]> {
  /**
   * The TypeSpec that defines each element in this SequenceTypeSpec.
   */
  elementSpec: TypeSpec<TSerializedElement, TDeserializedElement> | string;

  /**
   * The element name of the list elements.
   */
  xmlElementName?: string;
}

export interface SequenceSpecOptions {
  /**
   * The element name of the root element.
   */
  xmlRootName: string;

  /**
   * The element name of the sequence elements. Only used when this is a root list.
   */
  xmlElementName: string;
}

/**
 * A type specification that describes how to validate and serialize a Sequence of elements.
 */
export function sequenceSpec<TSerializedElement, TDeserializedElement>(elementSpec: TypeSpec<TSerializedElement, TDeserializedElement> | string, options?: SequenceSpecOptions): SequenceTypeSpec<TSerializedElement, TDeserializedElement> {
  return {
    specType: `Sequence`,
    elementSpec: elementSpec,
    ...options,

    serialize(propertyPath: PropertyPath, value: TDeserializedElement[], options: SerializationOptions): TSerializedElement[] {
      let result: TSerializedElement[];
      if (!Array.isArray(value)) {
        failSerializeTypeCheck(options, propertyPath, value, "an Array");
        result = value;
      } else {
        const elementTypeSpec: TypeSpec<TSerializedElement, TDeserializedElement> = resolveTypeSpec(options, propertyPath, elementSpec);
        result = [];
        for (let i = 0; i < value.length; i++) {
          result[i] = elementTypeSpec.serialize(propertyPath.concat([i.toString()]), value[i], options);
        }
      }
      return result;
    },

    deserialize(propertyPath: PropertyPath, value: TSerializedElement[], options: SerializationOptions): TDeserializedElement[] {
      let result: TDeserializedElement[];

      if (options.outputType === SerializationOutputType.XML) {
        if (value == undefined) {
          value = [];
        } else if (!Array.isArray(value)) {
          value = [value] as any;
        }
      }

      if (!Array.isArray(value)) {
        failDeserializeTypeCheck(options, propertyPath, value, "an Array");
        result = value as any;
      } else {
        const elementTypeSpec: TypeSpec<TSerializedElement, TDeserializedElement> = resolveTypeSpec(options, propertyPath, elementSpec);
        result = [];
        for (let i = 0; i < value.length; i++) {
          result[i] = elementTypeSpec.deserialize(propertyPath.concat([i.toString()]), value[i], options);
        }
      }
      return result;
    }
  };
}
