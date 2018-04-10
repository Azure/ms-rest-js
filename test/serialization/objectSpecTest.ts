// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import objectSpec from "../../lib/serialization/objectSpec";

describe("objectSpec", () => {
    it("should have \"object\" for its typeName property", () => {
        assert.strictEqual("object", objectSpec.typeName);
    });

    describe("serialize()", () => {
        it("should throw an error when given undefined", () => {
            try {
                objectSpec.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be an object.");
            }
        });

        it("should throw an error when given false", () => {
            try {
                objectSpec.serialize(["another", "property", "path"], false);
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be an object.");
            }
        });

        it("should throw an error when given []", () => {
            try {
                objectSpec.serialize(["another", "property", "path"], []);
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value [] must be an object.");
            }
        });

        it("should return the provided value with no error when given {}", () => {
            assert.deepEqual(objectSpec.serialize(["this", "one", "works"], {}), {});
        });
    });
});