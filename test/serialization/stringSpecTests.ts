// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import stringSpec from "../../lib/serialization/stringSpec";

describe("stringSpec", () => {
    it("should have \"string\" for its typeName property", () => {
        assert.strictEqual("string", stringSpec.typeName);
    });

    describe("serialize()", () => {
        it("should throw an error when given undefined", () => {
            try {
                stringSpec.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be a string.");
            }
        });

        it("should throw an error when given false", () => {
            try {
                stringSpec.serialize(["another", "property", "path"], false);
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be a string.");
            }
        });

        it("should return the provided value with no error when given \"abc\"", () => {
            assert.strictEqual(stringSpec.serialize(["this", "one", "works"], "abc"), "abc");
        });
    });
});