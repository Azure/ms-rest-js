"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var typeSpec_1 = require("./typeSpec");
/**
 * A type specification that describes how to validate and serialize a Date.
 */
var dateSpec = {
    typeName: "Date",
    serialize: function (propertyPath, value) {
        if (!value || (!(value instanceof Date) && (typeof value !== "string" || isNaN(Date.parse(value))))) {
            throw new Error(typeSpec_1.createValidationErrorMessage(propertyPath, value, "an instanceof Date or a string in ISO8601 format"));
        }
        return (value instanceof Date ? value : new Date(value)).toISOString().substring(0, 10);
    }
};
exports.default = dateSpec;
//# sourceMappingURL=dateSpec.js.map