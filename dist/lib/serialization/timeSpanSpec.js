"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var typeSpec_1 = require("./typeSpec");
var moment_1 = require("moment");
/**
 * A type specification that describes how to validate and serialize a Date.
 */
var timeSpanSpec = {
    typeName: "TimeSpan",
    serialize: function (propertyPath, value) {
        if (!value || (!moment_1.isDuration(value) && !(value.constructor && value.constructor.name === "Duration" && typeof value.isValid === "function" && value.isValid()))) {
            throw new Error(typeSpec_1.createValidationErrorMessage(propertyPath, value, "a TimeSpan/Duration"));
        }
        return value.toISOString();
    }
};
exports.default = timeSpanSpec;
//# sourceMappingURL=timeSpanSpec.js.map