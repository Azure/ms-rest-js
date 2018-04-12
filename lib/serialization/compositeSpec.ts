// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { SerializationOptions, SerializationOutputType } from "./serializationOptions";
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

export interface CompositeType {
  [key: string]: any;
}

/**
 * A type specification that describes how to validate and serialize a Composite value.
 */
export function compositeSpec(typeName: string, propertySpecs: { [propertyName: string]: PropertySpec }): TypeSpec<CompositeType, CompositeType> {
  return {
    typeName: `Composite<${typeName}>`,

    serialize(propertyPath: string[], value: CompositeType, options: SerializationOptions): CompositeType {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
      }

      const outputXML: boolean = (options && options.outputType === SerializationOutputType.XML);

      const serializedComposite: CompositeType = {};
      for (const childPropertyName in propertySpecs) {
        const childPropertySpec: PropertySpec = propertySpecs[childPropertyName];
        const childPropertyValue: any = value[childPropertyName];
        const childPropertyPath: string[] = propertyPath.concat([childPropertyName]);

        // Get the child property's value spec.
        let childPropertyValueSpec: TypeSpec<any, any>;
        if (typeof childPropertySpec.valueSpec === "string") {
          if (!options.compositeSpecDictionary || !options.compositeSpecDictionary[childPropertySpec.valueSpec]) {
            throw new Error(`Missing composite specification entry in composite type dictionary for type named "${childPropertySpec.valueSpec}".`);
          }
          childPropertyValueSpec = options.compositeSpecDictionary[childPropertySpec.valueSpec];
        } else {
          childPropertyValueSpec = childPropertySpec.valueSpec;
        }

        if (!childPropertyValue) {
          if (childPropertySpec.required && !childPropertySpec.constant) {
            throw new Error(`Missing non-constant ${childPropertyValueSpec.typeName} property at ${childPropertyPath.join(".")}.`);
          }
        } else if (!childPropertySpec.readonly) {

          // This variable will point to the object that will contain the serialized property.
          let propertyParent: CompositeType = serializedComposite;
          // The name of the serialized property.
          let serializedChildPropertyName: string;
          // The value of the serialized property.
          const serializedChildPropertyValue: any = childPropertyValueSpec.serialize(childPropertyPath, childPropertyValue, options);

          if (outputXML) {
            // XML
            if (childPropertySpec.xmlIsWrapped) {
              if (!childPropertySpec.xmlName) {
                throw new Error(`When the serialization output type is XML, property specification for ${childPropertyPath.join(".")} specified xmlIsWrapped but doesn't have an xmlName value.`);
              }
              if (!childPropertySpec.xmlElementName) {
                throw new Error(`When the serialization output type is XML, property specification for ${childPropertyPath.join(".")} specified xmlIsWrapped but doesn't have an xmlElementName value.`);
              }
              serializedChildPropertyName = `${childPropertySpec.xmlName}.${childPropertySpec.xmlElementName}`;
            } else {
              if (childPropertySpec.xmlElementName) {
                serializedChildPropertyName = childPropertySpec.xmlElementName;
              } else if (childPropertySpec.xmlName) {
                serializedChildPropertyName = childPropertySpec.xmlName;
              } else {
                throw new Error(`When the serialization output type is XML, property specification for ${childPropertyPath.join(".")} doesn't have a value for xmlElementName or xmlName.`);
              }

              if (childPropertySpec.xmlIsAttribute) {
                if (!serializedComposite.$) {
                  serializedComposite.$ = {};
                }
                propertyParent = serializedComposite.$;
              }
            }
          } else {
            // JSON
            serializedChildPropertyName = childPropertySpec.serializedName || childPropertyName;
          }

          // This part is for handling property flattening. If the serialized name has dots in its
          // name (a.b.c), then we handle those name parts (a, b, c) as individual levels in the
          // serialized value.
          const serializedChildPropertyNameParts: string[] = splitSerializeName(serializedChildPropertyName);
          if (serializedChildPropertyNameParts.length > 1) {
            for (let i = 0; i < serializedChildPropertyNameParts.length - 1; ++i) {
              const namePart: string = serializedChildPropertyNameParts[i];
              if (!propertyParent[namePart]) {
                propertyParent[namePart] = {};
              }
              propertyParent = propertyParent[namePart];
            }
            serializedChildPropertyName = serializedChildPropertyNameParts[serializedChildPropertyNameParts.length - 1];
          }

          // Write the serialized property value to its parent property container.
          propertyParent[serializedChildPropertyName] = serializedChildPropertyValue;
        }
      }

      return serializedComposite;
    },

    deserialize(propertyPath: string[], value: CompositeType): CompositeType {
      if (typeof value !== "object" || Array.isArray(value)) {
        throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
      }

      return {};
    }
  };
}

function splitSerializeName(prop: string): string[] {
  const classes: string[] = [];
  let partialclass = "";
  const subwords = prop.split(".");

  for (const item of subwords) {
    if (item.charAt(item.length - 1) === "\\") {
      partialclass += item.substr(0, item.length - 1) + ".";
    } else {
      partialclass += item;
      classes.push(partialclass);
      partialclass = "";
    }
  }

  return classes;
}

/**
 * A specification that describes a property on a Composite type.
 */
export interface PropertySpec {
  /**
   * The name of this property when it is serialized.
   */
  serializedName?: string;

  /**
   * Whether or not this property is required.
   */
  required?: boolean;

  /**
   * Whether or not this property's value is a constant.
   */
  constant?: boolean;

  /**
   * Whether or not this property's value is readonly.
   */
  readonly?: boolean;

  /**
   * Whether or not this property is the polymorphic discriminator for this composite type's
   * hierarchy.
   */
  polymorphicDiscriminator?: boolean;

  /**
   * Whether or not this property exists as an attribute.
   */
  xmlIsAttribute?: boolean;

  /**
   * Whether or not this property wraps a sequence of elements.
   */
  xmlIsWrapped?: boolean;

  /**
   * The element name of this property if it converted to an XML element.
   */
  xmlName?: string;

  /**
   * The name of child elements if this property is converted to an XML element.
   */
  xmlElementName?: string;

  /**
   * The specification for the value of this property, or the key to lookup the composite
   * specification within a composite specification dictionary.
   */
  valueSpec: TypeSpec<any, any> | string;
}