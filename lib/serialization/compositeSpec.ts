// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { SerializationOptions, SerializationOutputType } from "./serializationOptions";
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SpecPath } from "./specPath";

export interface CompositeType {
  [key: string]: any;
}

export interface CompositeTypeSpec extends TypeSpec<CompositeType, CompositeType> {
  /**
   * The name of the composite type (class) that this CompositeTypeSpec describes.
   */
  typeName: string;

  /**
   * The specifications for each of the properties that exist on the type that this
   * CompositeTypeSpec describes.
   */
  propertySpecs: { [propertyName: string]: PropertySpec };
}

/**
 * A type specification that describes how to validate and serialize a Composite value.
 */
export function compositeSpec(typeName: string, propertySpecs: { [propertyName: string]: PropertySpec }): CompositeTypeSpec {
  return {
    specType: "Composite",

    typeName: typeName,

    propertySpecs: propertySpecs,

    serialize(propertyPath: SpecPath, value: CompositeType, options: SerializationOptions): CompositeType {
      let result: CompositeType;
      if (typeof value !== "object" || Array.isArray(value)) {
        if (options.serializationStrictTypeChecking) {
          throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
        } else {
          result = <any>value;
        }
      } else {
        const xml: boolean = (options && options.outputType === SerializationOutputType.XML);

        result = {};
        for (const childPropertyName in propertySpecs) {
          const childPropertySpec: PropertySpec = propertySpecs[childPropertyName];
          const childPropertyValue: any = value[childPropertyName];

          // Get the child property's value spec.
          let childPropertyValueSpec: TypeSpec<any, any>;
          if (typeof childPropertySpec.valueSpec === "string") {
            if (!options.compositeSpecDictionary || !options.compositeSpecDictionary[childPropertySpec.valueSpec]) {
              throw new Error(`Missing composite specification entry in composite type dictionary for type named "${childPropertySpec.valueSpec}" at property ${propertyPath.pathStringConcat(childPropertyName)}.`);
            }
            childPropertyValueSpec = options.compositeSpecDictionary[childPropertySpec.valueSpec];
          } else {
            childPropertyValueSpec = childPropertySpec.valueSpec;
          }

          if (childPropertyValue == undefined) {
            if (childPropertySpec.required && !childPropertySpec.constant) {
              throw new Error(`Missing non-constant ${childPropertyValueSpec.specType} property at ${propertyPath.pathStringConcat(childPropertyName)}.`);
            }
          } else if (!childPropertySpec.readonly) {

            // This variable will point to the object that will contain the serialized property.
            let serializedPropertyParent: CompositeType = result;
            // The name of the serialized property.
            let serializedChildPropertyName: string;

            // Get the serializedChildPropertyName and the serializedPropertyParent.
            if (xml) {
              // XML
              if (childPropertySpec.xmlIsWrapped) {
                if (!childPropertySpec.xmlName) {
                  throw new Error(`When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} specified xmlIsWrapped but doesn't have an xmlName value.`);
                }
                if (!childPropertySpec.xmlElementName) {
                  throw new Error(`When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} specified xmlIsWrapped but doesn't have an xmlElementName value.`);
                }
                serializedChildPropertyName = `${childPropertySpec.xmlName}.${childPropertySpec.xmlElementName}`;
              } else {
                if (childPropertySpec.xmlElementName) {
                  serializedChildPropertyName = childPropertySpec.xmlElementName;
                } else if (childPropertySpec.xmlName) {
                  serializedChildPropertyName = childPropertySpec.xmlName;
                } else {
                  throw new Error(`When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} doesn't have a value for xmlElementName or xmlName.`);
                }

                if (childPropertySpec.xmlIsAttribute) {
                  if (!result.$) {
                    result.$ = {};
                  }
                  serializedPropertyParent = result.$;
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
                if (!serializedPropertyParent[namePart]) {
                  serializedPropertyParent[namePart] = {};
                }
                serializedPropertyParent = serializedPropertyParent[namePart];
              }
              serializedChildPropertyName = serializedChildPropertyNameParts[serializedChildPropertyNameParts.length - 1];
            }

            const childPropertyPath: SpecPath = propertyPath.concat([childPropertyName], serializedChildPropertyNameParts);

            // Write the serialized property value to its parent property container.
            serializedPropertyParent[serializedChildPropertyName] = childPropertyValueSpec.serialize(childPropertyPath, childPropertyValue, options);
          }
        }
      }

      return result;
    },

    deserialize(propertyPath: SpecPath, value: CompositeType, options: SerializationOptions): CompositeType {
      let result: CompositeType;

      if (typeof value !== "object" || Array.isArray(value)) {
        if (options && options.deserializationStrictTypeChecking) {
          throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
        } else {
          result = <any>value;
        }
      } else {
        const xml: boolean = (options && options.outputType === SerializationOutputType.XML);

        result = {};
        for (const childPropertyName in propertySpecs) {
          const childPropertySpec: PropertySpec = propertySpecs[childPropertyName];

          // Get the serializedChildPropertyName and the serializedPropertyParent.
          let serializedChildPropertyName: string;
          let serializedPropertyParent: CompositeType = value;
          if (xml) {
            // XML
            if (childPropertySpec.xmlIsWrapped) {
              if (!childPropertySpec.xmlName) {
                throw new Error(`When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} specified xmlIsWrapped but doesn't have an xmlName value.`);
              }
              if (!childPropertySpec.xmlElementName) {
                throw new Error(`When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} specified xmlIsWrapped but doesn't have an xmlElementName value.`);
              }
              serializedChildPropertyName = `${childPropertySpec.xmlName}.${childPropertySpec.xmlElementName}`;
            } else {
              if (childPropertySpec.xmlElementName) {
                serializedChildPropertyName = childPropertySpec.xmlElementName;
              } else if (childPropertySpec.xmlName) {
                serializedChildPropertyName = childPropertySpec.xmlName;
              } else {
                throw new Error(`When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} doesn't have a value for xmlElementName or xmlName.`);
              }

              if (childPropertySpec.xmlIsAttribute) {
                serializedPropertyParent = serializedPropertyParent.$;
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
              if (!serializedPropertyParent[namePart]) {
                break;
              } else {
                serializedPropertyParent = serializedPropertyParent[namePart];
              }
            }

            if (serializedPropertyParent) {
              serializedChildPropertyName = serializedChildPropertyNameParts[serializedChildPropertyNameParts.length - 1];
            }
          }

          // Get the child property's value spec.
          let childPropertyValueSpec: TypeSpec<any, any>;
          if (typeof childPropertySpec.valueSpec === "string") {
            if (!options.compositeSpecDictionary || !options.compositeSpecDictionary[childPropertySpec.valueSpec]) {
              throw new Error(`Missing composite specification entry in composite type dictionary for type named "${childPropertySpec.valueSpec}" at property ${propertyPath.pathStringConcat(childPropertyName)}.`);
            }
            childPropertyValueSpec = options.compositeSpecDictionary[childPropertySpec.valueSpec];
          } else {
            childPropertyValueSpec = childPropertySpec.valueSpec;
          }

          const childPropertyPath: SpecPath = propertyPath.concat([childPropertyName], serializedChildPropertyNameParts);

          const serializedChildPropertyValue: any = (!serializedPropertyParent ? undefined : serializedPropertyParent[serializedChildPropertyName]);
          if (serializedChildPropertyValue) {
            result[childPropertyName] = childPropertyValueSpec.deserialize(childPropertyPath, serializedChildPropertyValue, options);
          } else if (childPropertySpec.required && !childPropertySpec.constant) {
            if (options && options.deserializationStrictMissingProperties) {
              throw new Error(`Missing non-constant ${childPropertyValueSpec.specType} property at ${childPropertyPath}.`);
            } else {
              result[childPropertyName] = childPropertyValueSpec.deserialize(childPropertyPath, serializedChildPropertyValue, options);
            }
          }
        }
      }

      return result;
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