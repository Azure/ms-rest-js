// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import streamSpec from "../../lib/serialization/streamSpec";

describe("objectSpec", () => {
    it("should have \"Stream\" for its typeName property", () => {
        assert.strictEqual("Stream", streamSpec.typeName);
    });

    describe("serialize()", () => {
        it("should throw an error when given undefined", () => {
            try {
                streamSpec.serialize(["a", "property", "path"], undefined, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be a Stream.");
            }
        });

        it("should throw an error when given false", () => {
            try {
                streamSpec.serialize(["another", "property", "path"], false, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be a Stream.");
            }
        });

        it("should throw an error when given {}", () => {
            try {
                streamSpec.serialize(["another", "property", "path"], {}, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value {} must be a Stream.");
            }
        });

        it("should throw an error when given []", () => {
            try {
                streamSpec.serialize(["another", "property", "path"], [], {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value [] must be a Stream.");
            }
        });
    });
});