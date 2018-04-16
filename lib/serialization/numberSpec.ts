// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SpecPath } from "./specPath";

/**
 * A type specification that describes how to validate and serialize a number.
 */
const numberSpec: TypeSpec<number, number> = {
  specType: "number",

  serialize(propertyPath: SpecPath, value: number): number {
    if (typeof value !== "number") {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a number"));
    }
    return value;
  },

  deserialize(propertyPath: SpecPath, value: number): number {
    if (typeof value !== "number") {
      throw new Error(createValidationErrorMessage(propertyPath, value, "a number"));
    }
    return value;
  }
};

export default numberSpec;