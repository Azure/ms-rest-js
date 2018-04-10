"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var booleanSpec_1 = require("../../lib/serialization/booleanSpec");
describe("booleanSpec", function () {
    it("should have \"boolean\" for its typeName property", function () {
        assert.strictEqual("boolean", booleanSpec_1.default.typeName);
    });
    describe("serialize()", function () {
        it("should throw an error when given undefined", function () {
            try {
                booleanSpec_1.default.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be of type boolean.");
            }
        });
        it("should throw an error when given 5", function () {
            try {
                booleanSpec_1.default.serialize(["another", "property", "path"], 5);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value 5 must be of type boolean.");
            }
        });
        it("should return the provided value with no error when given true", function () {
            assert.strictEqual(booleanSpec_1.default.serialize(["this", "one", "works"], true), true);
        });
    });
});
//# sourceMappingURL=booleanSpecTests.js.map