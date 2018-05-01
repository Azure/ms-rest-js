// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, failDeserializeTypeCheck, failSerializeTypeCheck, SerializationOutputType } from "./serializationOptions";
import { TypeSpec } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const unixTimeSpec: TypeSpec<number, Date> = {
  specType: "UnixTime",

  serialize(propertyPath: PropertyPath, value: Date | string, options: SerializationOptions): number {
    let result: number;
    if (!value || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
      failSerializeTypeCheck(options, propertyPath, value, `an instanceof Date or a string in ISO8601 DateTime format`);
      result = value as any;
    } else {
      const valueDate: Date = (value instanceof Date ? value : new Date(value));
      result = Math.floor(valueDate.getTime() / 1000);
    }
    return result;
  },

  deserialize(propertyPath: PropertyPath, value: number | string, options: SerializationOptions): Date {
    if (typeof value === "string" && options.outputType === SerializationOutputType.XML) {
      const parsedValue = parseFloat(value);
      if (!isNaN(parsedValue)) {
        value = parsedValue;
      }
    }

    let result: Date;
    if (typeof value !== "number") {
      failDeserializeTypeCheck(options, propertyPath, value, "a unix time number");
      result = value as any;
    } else {
      result = new Date(value * 1000);
    }
    return result;
  }
};

export default unixTimeSpec;
