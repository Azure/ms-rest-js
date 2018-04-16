// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { isDuration, Duration, duration } from "moment";
import { SpecPath } from "./specPath";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const timeSpanSpec: TypeSpec<string, Duration> = {
  specType: "TimeSpan",

  serialize(propertyPath: SpecPath, value: Duration): string {
    if (!value || (!isDuration(value) && !((value as any).constructor && (value as any).constructor.name === "Duration" && typeof (value as any).isValid === "function" && (value as any).isValid()))) {
      throw new Error(createValidationErrorMessage(propertyPath, value, `a TimeSpan/Duration`));
    }
    return value.toISOString();
  },

  deserialize(propertyPath: SpecPath, value: any): Duration {
    if (!value || typeof value !== "string") {
      throw new Error(createValidationErrorMessage(propertyPath, value, `an ISO8601 TimeSpan/Duration string`));
    }
    return duration(value);
  }
};

export default timeSpanSpec;