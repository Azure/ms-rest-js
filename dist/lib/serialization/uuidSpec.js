"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var typeSpec_1 = require("./typeSpec");
var utils = require("../util/utils");
/**
 * A type specification that describes how to validate and serialize an UUID.
 */
var uuidSpec = {
    typeName: "UUID",
    serialize: function (propertyPath, value) {
        if (typeof value !== "string" || !utils.isValidUuid(value)) {
            throw new Error(typeSpec_1.createValidationErrorMessage(propertyPath, value, "an UUID"));
        }
        return value;
    }
};
exports.default = uuidSpec;
//# sourceMappingURL=uuidSpec.js.map