// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a Date.
 */
const dateSpec: TypeSpec<string> = {
    typeName: "Date",

    serialize(propertyPath: string[], value: any): string {
        if (!value || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
            throw new Error(createValidationErrorMessage(propertyPath, value, `an instanceof Date or a string in ISO8601 format`));
        }
        return (value instanceof Date ? value : new Date(value)).toISOString().substring(0, 10);
    }
};

export default dateSpec;