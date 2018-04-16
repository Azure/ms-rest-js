// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { SpecPath } from "./specPath";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const unixTimeSpec: TypeSpec<number, Date> = {
  specType: "UnixTime",

  serialize(propertyPath: SpecPath, value: Date | string): number {
    if (!value || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
      throw new Error(createValidationErrorMessage(propertyPath, value, `an instanceof Date or a string in ISO8601 format`));
    }
    const valueDate: Date = (value instanceof Date ? value : new Date(value));
    return Math.floor(valueDate.getTime() / 1000);
  },

  deserialize(propertyPath: SpecPath, value: number): Date {
    if (typeof value !== "number") {
      throw new Error(createValidationErrorMessage(propertyPath, value, `a number`));
    }
    return new Date(value * 1000);
  }
};

export default unixTimeSpec;