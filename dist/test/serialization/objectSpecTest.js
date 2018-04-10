"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var objectSpec_1 = require("../../lib/serialization/objectSpec");
describe("objectSpec", function () {
    it("should have \"object\" for its typeName property", function () {
        assert.strictEqual("object", objectSpec_1.default.typeName);
    });
    describe("serialize()", function () {
        it("should throw an error when given undefined", function () {
            try {
                objectSpec_1.default.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be an object.");
            }
        });
        it("should throw an error when given false", function () {
            try {
                objectSpec_1.default.serialize(["another", "property", "path"], false);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be an object.");
            }
        });
        it("should throw an error when given []", function () {
            try {
                objectSpec_1.default.serialize(["another", "property", "path"], []);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value [] must be an object.");
            }
        });
        it("should return the provided value with no error when given {}", function () {
            assert.deepEqual(objectSpec_1.default.serialize(["this", "one", "works"], {}), {});
        });
    });
});
//# sourceMappingURL=objectSpecTest.js.map