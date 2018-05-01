// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, SerializationOutputType, failDeserializeMissingRequiredPropertyCheck, failDeserializeTypeCheck, failSerializeMissingRequiredPropertyCheck, failSerializeTypeCheck, log, logAndCreateError, resolveTypeSpec, resolveCompositeTypeSpec } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

export interface CompositeType {
  [key: string]: any;
}

/**
 * The options that specify polymorphism for a CompositeTypeSpec.
 */
export interface Polymorphism {
  /**
   * The CompositeTypeSpecs that this CompositeTypeSpec "inherits" from.
   */
  inheritsFrom?: CompositeTypeSpec;

  /**
   * The names of the CompositeTypeSpecs that "inherit" from this CompositeTypeSpec.
   */
  inheritedBy?: string[];

  /**
   * The name of the property that determines what the actual type the polymorphic object is. If
   * this is not provided, then the discriminatorPropertyName of the parent type will be used.
   */
  discriminatorPropertyName?: string;

  /**
   * The serialized name of the property that determines what the actual type of the polymorphic
   * object is. If this is not provided, then the discriminatorPropertyName should be used.
   */
  discriminatorPropertySerializedName?: string;

  /**
   * The value of the discriminator property that would indicate that this CompositeTypeSpec is the
   * target TypeSpec for the value being serialized or deserialized.
   */
  discriminatorPropertyValue: any;
}

/**
 * The TypeSpec for serializing and deserializing a CompositeType.
 */
export interface CompositeTypeSpec extends TypeSpec<CompositeType, CompositeType>, CompositeSpecParameters {
}

/**
 * The extra details that describe a CompositeTypeSpec.
 */
export interface CompositeSpecParameters {
  /**
   * The name of the composite type (class) that this CompositeTypeSpec describes.
   */
  typeName: string;

  /**
   * The name of the root XML element (if this CompositeTypeSpec is the root of the object tree).
   */
  xmlRootName?: string;

  /**
   * The options that specify polymorphism for this CompositeTypeSpec.
   */
  polymorphism?: Polymorphism;

  /**
   * The specifications for each of the properties that exist on the type that this
   * CompositeTypeSpec describes.
   */
  propertySpecs?: { [propertyName: string]: PropertySpec };
}

/**
 * A type specification that describes how to validate and serialize a Composite value.
 */
export function compositeSpec(parameters: CompositeSpecParameters): CompositeTypeSpec {
  return {
    specType: "Composite",
    ...parameters,

    serialize(propertyPath: PropertyPath, value: CompositeType, options: SerializationOptions): CompositeType {
      let result: CompositeType;
      if (typeof value !== "object" || Array.isArray(value)) {
        failSerializeTypeCheck(options, propertyPath, value, "an object");
        result = value as any;
      } else {
        const xml: boolean = (options && options.outputType === SerializationOutputType.XML);

        result = {};

        const allCompositeTypeSpecs: CompositeType[] = getAllPolymorphicCompositeTypeSpecs(value, propertyPath, this, options, true);

        for (const compositeTypeSpec of allCompositeTypeSpecs) {
          if (compositeTypeSpec.propertySpecs) {
            for (const childPropertyName in compositeTypeSpec.propertySpecs) {
              const childPropertySpec: PropertySpec = compositeTypeSpec.propertySpecs[childPropertyName];
              const childPropertyValue: any = value[childPropertyName];

              const childPropertyPath: PropertyPath = propertyPath.pathStringConcat(childPropertyName);

              // Get the child property's value spec.
              const childPropertyValueSpec: TypeSpec<any, any> | undefined = resolveTypeSpec(options, childPropertyPath, childPropertySpec.valueSpec);

              if (childPropertyValue == undefined) {
                if (childPropertySpec.required && !childPropertySpec.constant) {
                  const childPropertyValueTypeName: string = childPropertyValueSpec ? childPropertyValueSpec.specType : `unknown`;
                  failSerializeMissingRequiredPropertyCheck(options, childPropertyPath, childPropertyValueTypeName);
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
                      throw logAndCreateError(options, `When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} specified xmlIsWrapped but doesn't have an xmlName value.`);
                    }
                    if (!childPropertySpec.xmlElementName) {
                      throw logAndCreateError(options, `When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} specified xmlIsWrapped but doesn't have an xmlElementName value.`);
                    }
                    serializedChildPropertyName = `${childPropertySpec.xmlName}.${childPropertySpec.xmlElementName}`;
                  } else {
                    if (childPropertySpec.xmlElementName) {
                      serializedChildPropertyName = childPropertySpec.xmlElementName;
                    } else if (childPropertySpec.xmlName) {
                      serializedChildPropertyName = childPropertySpec.xmlName;
                    } else {
                      serializedChildPropertyName = childPropertyName;
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

                const serializedChildPropertyPath: PropertyPath = propertyPath.concat([childPropertyName], serializedChildPropertyNameParts);

                // Write the serialized property value to its parent property container.
                if (!childPropertyValueSpec) {
                  serializedPropertyParent[serializedChildPropertyName] = childPropertyValue;
                } else {
                  serializedPropertyParent[serializedChildPropertyName] = childPropertyValueSpec.serialize(serializedChildPropertyPath, childPropertyValue, options);
                }
              }
            }
          }
        }
      }

      return result;
    },

    deserialize(propertyPath: PropertyPath, value: CompositeType, options: SerializationOptions): CompositeType {
      let result: CompositeType;

      if (typeof value !== "object" || Array.isArray(value)) {
        failDeserializeTypeCheck(options, propertyPath, value, "an object");
        result = value as any;
      } else {
        const xml: boolean = (options && options.outputType === SerializationOutputType.XML);

        result = {};

        const allCompositeTypeSpecs: CompositeType[] = getAllPolymorphicCompositeTypeSpecs(value, propertyPath, this, options, false);

        for (const compositeTypeSpec of allCompositeTypeSpecs) {
          if (compositeTypeSpec.propertySpecs) {
            for (const childPropertyName in compositeTypeSpec.propertySpecs) {
              const childPropertySpec: PropertySpec = compositeTypeSpec.propertySpecs[childPropertyName];

              // Get the serializedChildPropertyName and the serializedPropertyParent.
              let serializedChildPropertyName: string;
              let serializedPropertyParent: CompositeType = value;
              if (xml) {
                // XML
                if (childPropertySpec.xmlIsWrapped) {
                  if (!childPropertySpec.xmlName) {
                    throw logAndCreateError(options, `When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} specified xmlIsWrapped but doesn't have an xmlName value.`);
                  }
                  if (!childPropertySpec.xmlElementName) {
                    throw logAndCreateError(options, `When the serialization output type is XML, property specification for ${propertyPath.pathStringConcat(childPropertyName)} specified xmlIsWrapped but doesn't have an xmlElementName value.`);
                  }
                  serializedChildPropertyName = `${childPropertySpec.xmlName}.${childPropertySpec.xmlElementName}`;
                } else {
                  if (childPropertySpec.xmlElementName) {
                    serializedChildPropertyName = childPropertySpec.xmlElementName;
                  } else if (childPropertySpec.xmlName) {
                    serializedChildPropertyName = childPropertySpec.xmlName;
                  } else {
                    serializedChildPropertyName = childPropertyName;
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

              const childPropertyPath: PropertyPath = propertyPath.concat([childPropertyName], serializedChildPropertyNameParts);

              // Get the child property's value spec.
              const childPropertyValueSpec: TypeSpec<any, any> = resolveTypeSpec(options, childPropertyPath, childPropertySpec.valueSpec);
              const serializedChildPropertyValue: any = (!serializedPropertyParent ? undefined : serializedPropertyParent[serializedChildPropertyName]);

              if (serializedChildPropertyValue != undefined) {
                result[childPropertyName] = childPropertyValueSpec.deserialize(childPropertyPath, serializedChildPropertyValue, options);
              } else if (childPropertySpec.required && !childPropertySpec.constant) {
                failDeserializeMissingRequiredPropertyCheck(options, childPropertyPath, childPropertyValueSpec.specType);
              }
            }
          }
        }
      }

      return result;
    }
  };
}

function getDiscriminatorPropertyName(compositeSpecPolymorphism: Polymorphism, compositeSpecName: string, options: SerializationOptions, isSerialization: boolean): string {
  let currentPolymorphism: Polymorphism = compositeSpecPolymorphism;

  let result: string | undefined = undefined;
  while (!result) {
    if (isSerialization) {
      result = currentPolymorphism.discriminatorPropertyName;
    } else {
      result = currentPolymorphism.discriminatorPropertySerializedName || currentPolymorphism.discriminatorPropertyName;
    }

    if (!result) {
      if (!currentPolymorphism.inheritsFrom || !currentPolymorphism.inheritsFrom.polymorphism) {
        throw logAndCreateError(options, `No discriminator property name is specified in ${compositeSpecName} or any of its base types.`);
      } else {
        currentPolymorphism = currentPolymorphism.inheritsFrom.polymorphism;
      }
    }
  }
  return result;
}

/**
 * Get all of the CompositeTypeSpecs that the provided value must implement if the starting
 * CompositeTypeSpec is the provided compositeSpec.
 */
function getAllPolymorphicCompositeTypeSpecs(value: CompositeType, propertyPath: PropertyPath, compositeSpec: CompositeTypeSpec, options: SerializationOptions, isSerialization: boolean): CompositeTypeSpec[] {
  const result: CompositeTypeSpec[] = [];

  let compositeSpecChanged = true;
  while (compositeSpecChanged) {
    compositeSpecChanged = false;

    // If the current compositeTypeSpec doesn't specify polymorphism details or if it doesn't
    // specify any derived type details, then we're done searching.
    const compositeSpecPolymorphism: Polymorphism | undefined = compositeSpec.polymorphism;
    if (compositeSpecPolymorphism) {
      const rawDiscriminatorPropertyName: string = getDiscriminatorPropertyName(compositeSpecPolymorphism, compositeSpec.typeName, options, isSerialization);
      const discriminatorPropertyPath: string[] = splitSerializeName(rawDiscriminatorPropertyName);
      const discriminatorPropertyValue: any = getPropertyValue(value, discriminatorPropertyPath);

      if (discriminatorPropertyValue == undefined) {
        throw logAndCreateError(options, `Missing polymorphic discriminator property at ${propertyPath.concat(discriminatorPropertyPath)} for composite type ${compositeSpec.typeName}.`);
      }

      const compositeSpecInheritedBy: string[] | undefined = compositeSpecPolymorphism.inheritedBy;
      if (compositeSpecInheritedBy) {
        // If the current compositeTypeSpec does have derived types, then start by getting the
        // value for the polymorphic discriminator property.
        if (discriminatorPropertyValue !== compositeSpecPolymorphism.discriminatorPropertyValue) {
          // Iterate through each of the derived types of the current compositeSpec and find the one
          // that matches the discriminator property value in the CompositeType value. Remember that
          // if multiple levels of the type hierarchy use the same polymorphic discriminator property,
          // then this may turn into a tree search instead of a list search.
          const derivedTypeDetailsToCheck: CompositeTypeSpec[] = [];
          for (const derivedCompositeTypeSpecName of compositeSpecInheritedBy) {
            derivedTypeDetailsToCheck.push(resolveCompositeTypeSpec(options, propertyPath, derivedCompositeTypeSpecName));
          }

          while (derivedTypeDetailsToCheck.length > 0) {
            const derivedTypeSpec: CompositeTypeSpec | undefined = derivedTypeDetailsToCheck.pop();
            if (derivedTypeSpec) {
              const derivedTypeSpecPolymorphism: Polymorphism | undefined = derivedTypeSpec.polymorphism;
              if (!derivedTypeSpecPolymorphism) {
                throw logAndCreateError(options, `Missing polymorphism property in CompositeTypeSpec ${derivedTypeSpec.typeName}, even though it inherits from another CompositeTypeSpec.`);
              } else if (discriminatorPropertyValue === derivedTypeSpecPolymorphism.discriminatorPropertyValue) {
                compositeSpec = derivedTypeSpec;
                compositeSpecChanged = true;
                break;
              } else if (derivedTypeSpecPolymorphism.inheritedBy && (!derivedTypeSpecPolymorphism.discriminatorPropertyName || derivedTypeSpecPolymorphism.discriminatorPropertyName === rawDiscriminatorPropertyName)) {
                // Even though this particular derived typeSpec's polymorphic discriminator property
                // value doesn't match the provided value's property value, it may have derived types
                // that do. If the derived typeSpec's polymorphic discriminator property is the same
                // as the current compositeTypeSpec's polymorphic discriminator property, then add all
                // of the derived typeSpec's derived types to the list of typeSpecs to check.
                for (const childDerivedTypeSpecName of derivedTypeSpecPolymorphism.inheritedBy) {
                  derivedTypeDetailsToCheck.push(resolveCompositeTypeSpec(options, propertyPath, childDerivedTypeSpecName));
                }
              }
            }
          }

          if (!compositeSpecChanged) {
            const message = `Unrecognized polymorphic discriminator value ${discriminatorPropertyValue} for composite type ${compositeSpec.typeName} at property ${propertyPath.concat(discriminatorPropertyPath)}.`;
            if (options && (isSerialization ? options.serializationStrictRequiredPolymorphicDiscriminator : options.deserializationStrictRequiredPolymorphicDiscriminator)) {
              throw logAndCreateError(options, message);
            } else {
              log(options, HttpPipelineLogLevel.WARNING, message);
            }
          }
        }
      }
    }
  }

  const toVisit: CompositeTypeSpec[] = [compositeSpec];
  while (toVisit.length > 0) {
    const currentCompositeSpec: CompositeTypeSpec | undefined = toVisit.pop();
    if (currentCompositeSpec && result.indexOf(currentCompositeSpec) === -1) {
      result.push(currentCompositeSpec);

      if (currentCompositeSpec.polymorphism && currentCompositeSpec.polymorphism.inheritsFrom) {
        let inheritsFrom: (CompositeTypeSpec | string)[];
        if (Array.isArray(currentCompositeSpec.polymorphism.inheritsFrom)) {
          inheritsFrom = currentCompositeSpec.polymorphism.inheritsFrom;
        } else {
          inheritsFrom = [currentCompositeSpec.polymorphism.inheritsFrom];
        }

        for (const baseCompositeTypeSpec of inheritsFrom) {
          toVisit.push(resolveCompositeTypeSpec(options, propertyPath, baseCompositeTypeSpec));
        }
      }
    }
  }

  return result;
}

function getPropertyValue(value: CompositeType, propertyPath: string[]): any {
  let result: any = value;
  if (result && propertyPath && propertyPath.length > 0) {
    for (const propertyPathSegment of propertyPath) {
      result = result[propertyPathSegment];
      if (result == undefined) {
        break;
      }
    }
  }
  return result;
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
