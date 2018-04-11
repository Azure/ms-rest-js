// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import { TypeSpec, createValidationErrorMessage } from "./typeSpec";

/**
 * A type specification that describes how to validate and serialize a ByteArray.
 */
const byteArraySpec: TypeSpec<string> = {
    typeName: "ByteArray(Buffer)",

    serialize(propertyPath: string[], value: any): string {
        if (!value || typeof value.constructor.isBuffer !== "function" || !value.constructor.isBuffer(value)) {
            throw new Error(createValidationErrorMessage(propertyPath, value, "a ByteArray(Buffer)"));
        }
        return value.toString("base64");
    }
};

export default byteArraySpec;