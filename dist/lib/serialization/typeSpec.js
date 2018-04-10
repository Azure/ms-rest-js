"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create an error message for an invalid serialization.
 * @param propertyPath The path to the property with the serialization error.
 * @param value The value that failed the serialization.
 * @param expectedConditionDescription A brief description of what type was expected.
 */
function createValidationErrorMessage(propertyPath, value, expectedConditionDescription) {
    return "Property " + propertyPath.join(".") + " with value " + JSON.stringify(value) + " must be " + expectedConditionDescription + ".";
}
exports.createValidationErrorMessage = createValidationErrorMessage;
//# sourceMappingURL=typeSpec.js.map