// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const dateSpec: TypeSpec<string, Date> = {
  typeName: "Date",

  serialize(propertyPath: string[], value: Date | string): string {
    if (!value || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
      throw new Error(createValidationErrorMessage(propertyPath, value, `an instanceof Date or a string in ISO8601 Date format`));
    }
    return (value instanceof Date ? value : new Date(value)).toISOString().substring(0, 10);
  },

  deserialize(propertyPath: string[], value: string): Date {
    if (!value || typeof value !== "string") {
      throw new Error(createValidationErrorMessage(propertyPath, value, `a string in ISO8601 Date format`));
    }
    return new Date(value);
  }
};

export default dateSpec;