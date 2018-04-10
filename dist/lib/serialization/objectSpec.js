"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var typeSpec_1 = require("./typeSpec");
/**
 * A type specification that describes how to validate and serialize an object.
 */
var objectSpec = {
    typeName: "object",
    serialize: function (propertyPath, value) {
        if (typeof value !== "object" || Array.isArray(value)) {
            throw new Error(typeSpec_1.createValidationErrorMessage(propertyPath, value, "an object"));
        }
        return value;
    }
};
exports.default = objectSpec;
//# sourceMappingURL=objectSpec.js.map