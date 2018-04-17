// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, log } from "./serializationOptions";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const unixTimeSpec: TypeSpec<number, Date> = {
  specType: "UnixTime",

  serialize(propertyPath: PropertyPath, value: Date | string, options: SerializationOptions): number {
    let result: number;
    if (!value || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, `an instanceof Date or a string in ISO8601 DateTime format`);
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, `an instanceof Date or a string in ISO8601 DateTime format`));
      }

      result = value as any;
    } else {
      const valueDate: Date = (value instanceof Date ? value : new Date(value));
      result = Math.floor(valueDate.getTime() / 1000);
    }
    return result;
  },

  deserialize(propertyPath: PropertyPath, value: number, options: SerializationOptions): Date {
    let result: Date;
    if (typeof value !== "number") {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, `a unix time number`);
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, `a unix time number`));
      }

      result = value as any;
    } else {
      result = new Date(value * 1000);
    }
    return result;
  }
};

export default unixTimeSpec;