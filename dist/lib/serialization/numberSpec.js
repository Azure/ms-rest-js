"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var typeSpec_1 = require("./typeSpec");
/**
 * A type specification that describes how to validate and serialize a number.
 */
var numberSpec = {
    typeName: "number",
    serialize: function (propertyPath, value) {
        if (typeof value !== "number") {
            throw new Error(typeSpec_1.createValidationErrorMessage(propertyPath, value, "of type number"));
        }
        return value;
    }
};
exports.default = numberSpec;
//# sourceMappingURL=numberSpec.js.map