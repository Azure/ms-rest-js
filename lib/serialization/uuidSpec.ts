// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import * as utils from "../util/utils";
import { PropertyPath } from "./propertyPath";

/**
 * A type specification that describes how to validate and serialize a UUID.
 */
const uuidSpec: TypeSpec<string, string> = {
  specType: "UUID",

  serialize(propertyPath: PropertyPath, value: string): string {
    if (typeof value !== "string" || !utils.isValidUuid(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a UUID string"));
    }
    return value;
  },

  deserialize(propertyPath: PropertyPath, value: string): string {
    if (typeof value !== "string" || !utils.isValidUuid(value)) {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a UUID string"));
    }
    return value;
  }
};

export default uuidSpec;