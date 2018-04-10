"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var numberSpec_1 = require("../../lib/serialization/numberSpec");
describe("numberSpec", function () {
    it("should have \"number\" for its typeName property", function () {
        assert.strictEqual("number", numberSpec_1.default.typeName);
    });
    describe("serialize()", function () {
        it("should throw an error when given undefined", function () {
            try {
                numberSpec_1.default.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be of type number.");
            }
        });
        it("should throw an error when given \"\"", function () {
            try {
                numberSpec_1.default.serialize(["another", "property", "path"], "");
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value \"\" must be of type number.");
            }
        });
        it("should return the provided value with no error when given 12", function () {
            assert.strictEqual(numberSpec_1.default.serialize(["this", "one", "works"], 12), 12);
        });
    });
});
//# sourceMappingURL=numberSpecTests.js.map