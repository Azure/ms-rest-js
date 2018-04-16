// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, log } from "./serializationOptions";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const dateTimeRfc1123Spec: TypeSpec<string, Date> = {
  specType: "DateTimeRFC1123",

  serialize(propertyPath: PropertyPath, value: Date | string, options: SerializationOptions): string {
    let result: string;
    if (value == undefined || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, `an instanceof Date or a string in RFC1123 DateTime format`);
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, `an instanceof Date or a string in RFC1123 DateTime format`));
      }

      result = value as any;
    } else {
      result = (value instanceof Date ? value : new Date(value)).toUTCString();
    }
    return result;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): Date {
    let result: Date;
    if (value == undefined || typeof value !== "string" || isNaN(Date.parse(value))) {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, `a string in RFC1123 DateTime format`);
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, `a string in RFC1123 DateTime format`));
      }

      result = value as any;
    } else {
      result = new Date(value);
    }
    return result;
  }
};

export default dateTimeRfc1123Spec;