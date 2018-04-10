"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var typeSpec_1 = require("./typeSpec");
/**
 * A type specification that describes how to validate and serialize a Date.
 */
var dateTimeRfc1123Spec = {
    typeName: "DateTimeRFC1123",
    serialize: function (propertyPath, value) {
        if (!value || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
            throw new Error(typeSpec_1.createValidationErrorMessage(propertyPath, value, "an instanceof Date or a string in ISO8601 format"));
        }
        return (value instanceof Date ? value : new Date(value)).toUTCString();
    }
};
exports.default = dateTimeRfc1123Spec;
//# sourceMappingURL=dateTimeRfc1123Spec.js.map