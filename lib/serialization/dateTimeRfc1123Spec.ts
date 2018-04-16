// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { PropertyPath } from "./propertyPath";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const dateTimeRfc1123Spec: TypeSpec<string, Date> = {
  specType: "DateTimeRFC1123",

  serialize(propertyPath: PropertyPath, value: Date | string): string {
    if (!value || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
      throw new Error(createValidationErrorMessage(propertyPath, value, `an instanceof Date or a string in RFC1123 DateTime format`));
    }
    return (value instanceof Date ? value : new Date(value)).toUTCString();
  },

  deserialize(propertyPath: PropertyPath, value: string): Date {
    if (!value || typeof value !== "string") {
      throw new Error(createValidationErrorMessage(propertyPath, value, `a string in ISO8601 Date format`));
    }
    return new Date(value);
  }
};

export default dateTimeRfc1123Spec;