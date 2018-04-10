// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize an object.
 */
export function enumSpec<T>(enumName: string, allowedValues: T[]): TypeSpec<T> {
    return {
        typeName: `Enum<${enumName}>`,

        allowedValues: allowedValues,

        serialize(propertyPath: string[], value: any): T {
            const foundMatch: boolean = allowedValues.some((item) => {
                return item === value || (typeof item === "string" && typeof value === "string" && item.toLowerCase() === value.toLowerCase());
            });
            if (!foundMatch) {
                throw new Error(createValidationErrorMessage(propertyPath, value, `one of the enum allowed values: ${JSON.stringify(allowedValues)}`));
            }
            return value;
        }
    };
}