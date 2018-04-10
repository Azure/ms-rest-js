// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a string.
 */
const stringSpec: TypeSpec<string> = {
    typeName: "string",

    serialize(propertyPath: string[], value: any): string {
        if (typeof value !== "string") {
            throw new Error(createValidationErrorMessage(propertyPath, value, "of type string"));
        }
        return value;
    }
};

export default stringSpec;