// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { Duration, duration, isDuration } from "moment";
import { PropertyPath } from "./propertyPath";
import { SerializationOptions, log } from "./serializationOptions";
import { TypeSpec, createValidationErrorMessage, createValidationWarningMessage } from "./typeSpec";
import { HttpPipelineLogLevel } from "../httpPipelineLogLevel";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const timeSpanSpec: TypeSpec<string, Duration> = {
  specType: "TimeSpan",

  serialize(propertyPath: PropertyPath, value: Duration, options: SerializationOptions): string {
    let result: string;
    if (!value || (!isDuration(value) && !((value as any).constructor && (value as any).constructor.name === "Duration" && typeof (value as any).isValid === "function" && (value as any).isValid()))) {
      if (options && options.serializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, `a TimeSpan/Duration`);
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, `a TimeSpan/Duration`));
      }

      result = value;
    } else {
      result = value.toISOString();
    }
    return result;
  },

  deserialize(propertyPath: PropertyPath, value: string, options: SerializationOptions): Duration {
    let result: Duration;
    if (!value || typeof value !== "string" || !iso8601TimeSpanRegExp.exec(value)) {
      if (options && options.deserializationStrictTypeChecking) {
        const errorMessage: string = createValidationErrorMessage(propertyPath, value, `an ISO8601 TimeSpan/Duration string`);
        log(options, HttpPipelineLogLevel.ERROR, errorMessage);
        throw new Error(errorMessage);
      } else {
        log(options, HttpPipelineLogLevel.WARNING, createValidationWarningMessage(propertyPath, value, `an ISO8601 TimeSpan/Duration string`));
      }

      result = value as any;
    } else {
      result = duration(value);
    }
    return result;
  }
};

/**
 * Regular expression for ISO8601 TimeSpan/Durations. This was copied from moment.js.
 */
const iso8601TimeSpanRegExp: RegExp = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

export default timeSpanSpec;