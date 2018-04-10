"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var uuidSpec_1 = require("../../lib/serialization/uuidSpec");
describe("uuidSpec", function () {
    it("should have \"UUID\" for its typeName property", function () {
        assert.strictEqual("UUID", uuidSpec_1.default.typeName);
    });
    describe("serialize()", function () {
        it("should throw an error when given undefined", function () {
            try {
                uuidSpec_1.default.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be an UUID.");
            }
        });
        it("should throw an error when given false", function () {
            try {
                uuidSpec_1.default.serialize(["another", "property", "path"], false);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be an UUID.");
            }
        });
        it("should throw an error when given []", function () {
            try {
                uuidSpec_1.default.serialize(["another", "property", "path"], []);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value [] must be an UUID.");
            }
        });
        it("should throw an error when given \"abc\"", function () {
            try {
                uuidSpec_1.default.serialize(["another", "property", "path"], "abc");
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value \"abc\" must be an UUID.");
            }
        });
        it("should return the provided value with no error when given \"123e4567-e89b-12d3-a456-426655440000\"", function () {
            assert.deepEqual(uuidSpec_1.default.serialize(["this", "one", "works"], "123e4567-e89b-12d3-a456-426655440000"), "123e4567-e89b-12d3-a456-426655440000");
        });
    });
});
//# sourceMappingURL=uuidSpecTests.js.map