"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var enumSpec_1 = require("../../lib/serialization/enumSpec");
describe("enumSpec", function () {
    it("should have \"Enum<Letters>\" for its typeName property", function () {
        assert.strictEqual("Enum<Letters>", enumSpec_1.enumSpec("Letters", []).typeName);
    });
    describe("serialize()", function () {
        it("should throw an error when given undefined", function () {
            try {
                enumSpec_1.enumSpec("Letters", ["a", "b", "c"]).serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be one of the enum allowed values: [\"a\",\"b\",\"c\"].");
            }
        });
        it("should throw an error when given \"\"", function () {
            try {
                enumSpec_1.enumSpec("Letters", ["a", "b", "c"]).serialize(["another", "property", "path"], "");
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value \"\" must be one of the enum allowed values: [\"a\",\"b\",\"c\"].");
            }
        });
        it("should return the provided value with no error when given \"a\"", function () {
            assert.strictEqual(enumSpec_1.enumSpec("Letters", ["a", "b", "c"]).serialize(["this", "one", "works"], "a"), "a");
        });
        it("should return the provided value with no error when given \"A\"", function () {
            assert.strictEqual(enumSpec_1.enumSpec("Letters", ["a", "b", "c"]).serialize(["this", "one", "works"], "A"), "A");
        });
    });
});
//# sourceMappingURL=enumSpecTests.js.map