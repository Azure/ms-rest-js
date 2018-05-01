// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const dateSpec: TypeSpec<string, Date> = {
  specType: "Date",

  serialize(propertyPath: PropertyPath, value: Date | string, options: SerializationOptions): string {
    let result: string;
    if (value == undefined || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
      failSerializeTypeCheck(options, propertyPath, value, `an instanceof Date or a string in ISO8601 Date format`);
      result = value as any;
    } else {
      result = (value instanceof Date ? value : new Date(value)).toISOString().substring(0, 10);
    }
    return result;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): Date {
    let result: Date;
    if (value == undefined || typeof value !== "string" || isNaN(Date.parse(value))) {
      failDeserializeTypeCheck(options, propertyPath, value, `a string in ISO8601 Date format`);
      result = value as any;
    } else {
      result = new Date(value);
    }
    return result;
  }
};

export default dateSpec;
