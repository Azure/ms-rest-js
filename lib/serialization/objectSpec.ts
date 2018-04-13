// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SpecPath } from "./specPath";

export interface ObjectType {
  [key: string]: any;
}

/**
 * A type specification that describes how to validate and serialize an object.
 */
const objectSpec: TypeSpec<ObjectType, ObjectType> = {
  specType: "object",

  serialize(propertyPath: SpecPath, value: { [key: string]: any }): { [key: string]: any } {
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
    }
    return value;
  },

  deserialize(propertyPath: SpecPath, value: { [key: string]: any }): { [key: string]: any } {
    if (typeof value !== "object" || Array.isArray(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "an object"));
    }
    return value;
  }
};

export default objectSpec;