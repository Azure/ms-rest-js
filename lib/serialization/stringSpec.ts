// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SpecPath } from "./specPath";

/**
 * A type specification that describes how to validate and serialize a string.
 */
const stringSpec: TypeSpec<string, string> = {
  specType: "string",

  serialize(propertyPath: SpecPath, value: string): string {
    if (typeof value !== "string") {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a string"));
    }
    return value;
  },

  deserialize(propertyPath: SpecPath, value: string): string {
    if (typeof value !== "string") {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a string"));
    }
    return value;
  }
};

export default stringSpec;