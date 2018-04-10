// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";
import { isDuration } from "moment";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const timeSpanSpec: TypeSpec<string> = {
    typeName: "TimeSpan",

    serialize(propertyPath: string[], value: any): string {
        if (!value || (!isDuration(value) && !(value.constructor && value.constructor.name === "Duration" && typeof value.isValid === "function" && value.isValid()))) {
            throw new Error(createValidationErrorMessage(propertyPath, value, `a TimeSpan/Duration`));
        }
        return value.toISOString();
    }
};

export default timeSpanSpec;