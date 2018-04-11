// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { enumSpec } from "../../lib/serialization/enumSpec";

describe("enumSpec", () => {
    it("should have \"Enum<Letters>\" for its typeName property", () => {
        assert.strictEqual("Enum<Letters>", enumSpec("Letters", []).typeName);
    });

    describe("serialize()", () => {
        it("should throw an error when given undefined", () => {
            try {
                enumSpec("Letters", ["a", "b", "c"]).serialize(["a", "property", "path"], undefined, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, `Property a.property.path with value undefined must be one of the enum allowed values: ["a","b","c"].`);
            }
        });

        it("should throw an error when given \"\"", () => {
            try {
                enumSpec("Letters", ["a", "b", "c"]).serialize(["another", "property", "path"], "", {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, `Property another.property.path with value \"\" must be one of the enum allowed values: ["a","b","c"].`);
            }
        });

        it("should return the provided value with no error when given \"a\"", () => {
            assert.strictEqual(enumSpec("Letters", ["a", "b", "c"]).serialize(["this", "one", "works"], "a", {}), "a");
        });

        it("should return the provided value with no error when given \"A\"", () => {
            assert.strictEqual(enumSpec("Letters", ["a", "b", "c"]).serialize(["this", "one", "works"], "A", {}), "A");
        });
    });
});