"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
var assert = require("assert");
var streamSpec_1 = require("../../lib/serialization/streamSpec");
describe("objectSpec", function () {
    it("should have \"Stream\" for its typeName property", function () {
        assert.strictEqual("Stream", streamSpec_1.default.typeName);
    });
    describe("serialize()", function () {
        it("should throw an error when given undefined", function () {
            try {
                streamSpec_1.default.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be a Stream.");
            }
        });
        it("should throw an error when given false", function () {
            try {
                streamSpec_1.default.serialize(["another", "property", "path"], false);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be a Stream.");
            }
        });
        it("should throw an error when given {}", function () {
            try {
                streamSpec_1.default.serialize(["another", "property", "path"], {});
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value {} must be a Stream.");
            }
        });
        it("should throw an error when given []", function () {
            try {
                streamSpec_1.default.serialize(["another", "property", "path"], []);
                assert.fail("Expected an error to be thrown.");
            }
            catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value [] must be a Stream.");
            }
        });
    });
});
//# sourceMappingURL=streamSpecTests.js.map