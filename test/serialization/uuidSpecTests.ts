// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import uuidSpec from "../../lib/serialization/uuidSpec";

describe("uuidSpec", () => {
    it("should have \"UUID\" for its typeName property", () => {
        assert.strictEqual("UUID", uuidSpec.typeName);
    });

    describe("serialize()", () => {
        it("should throw an error when given undefined", () => {
            try {
                uuidSpec.serialize(["a", "property", "path"], undefined, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be a UUID.");
            }
        });

        it("should throw an error when given false", () => {
            try {
                uuidSpec.serialize(["another", "property", "path"], false, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be a UUID.");
            }
        });

        it("should throw an error when given []", () => {
            try {
                uuidSpec.serialize(["another", "property", "path"], [], {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value [] must be a UUID.");
            }
        });

        it("should throw an error when given \"abc\"", () => {
            try {
                uuidSpec.serialize(["another", "property", "path"], "abc", {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value \"abc\" must be a UUID.");
            }
        });

        it("should return the provided value with no error when given \"123e4567-e89b-12d3-a456-426655440000\"", () => {
            assert.deepEqual(uuidSpec.serialize(["this", "one", "works"], "123e4567-e89b-12d3-a456-426655440000", {}), "123e4567-e89b-12d3-a456-426655440000");
        });
    });
});