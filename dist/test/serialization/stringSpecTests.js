"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var stringSpec_1 = require("../../lib/serialization/stringSpec");
describe("stringSpec", function () {
    it("should have \"string\" for its typeName property", function () {
        assert.strictEqual("string", stringSpec_1.default.typeName);
    });
    describe("serialize()", function () {
        it("should throw an error when given undefined", function () {
            try {
                stringSpec_1.default.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be of type string.");
            }
        });
        it("should throw an error when given false", function () {
            try {
                stringSpec_1.default.serialize(["another", "property", "path"], false);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be of type string.");
            }
        });
        it("should return the provided value with no error when given \"abc\"", function () {
            assert.strictEqual(stringSpec_1.default.serialize(["this", "one", "works"], "abc"), "abc");
        });
    });
});
//# sourceMappingURL=stringSpecTests.js.map