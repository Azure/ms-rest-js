// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a boolean.
 */
const booleanSpec: TypeSpec<boolean> = {
    typeName: "boolean",

    serialize(propertyPath: string[], value: any): boolean {
        if (typeof value !== "boolean") {
            throw new Error(createValidationErrorMessage(propertyPath, value, "a boolean"));
        }
        return value;
    }
};

export default booleanSpec;