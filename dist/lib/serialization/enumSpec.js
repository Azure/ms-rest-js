"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var typeSpec_1 = require("./typeSpec");
/**
 * A type specification that describes how to validate and serialize an object.
 */
function enumSpec(enumName, allowedValues) {
    return {
        typeName: "Enum<" + enumName + ">",
        allowedValues: allowedValues,
        serialize: function (propertyPath, value) {
            var foundMatch = allowedValues.some(function (item) {
                return item === value || (typeof item === "string" && typeof value === "string" && item.toLowerCase() === value.toLowerCase());
            });
            if (!foundMatch) {
                throw new Error(typeSpec_1.createValidationErrorMessage(propertyPath, value, "one of the enum allowed values: " + JSON.stringify(allowedValues)));
            }
            return value;
        }
    };
}
exports.enumSpec = enumSpec;
//# sourceMappingURL=enumSpec.js.map