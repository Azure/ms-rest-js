// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import numberSpec from "../../lib/serialization/numberSpec";

describe("numberSpec", () => {
    it("should have \"number\" for its typeName property", () => {
        assert.strictEqual("number", numberSpec.typeName);
    });

    describe("serialize()", () => {
        it("should throw an error when given undefined", () => {
            try {
                numberSpec.serialize(["a", "property", "path"], undefined, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be a number.");
            }
        });

        it("should throw an error when given \"\"", () => {
            try {
                numberSpec.serialize(["another", "property", "path"], "", {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value \"\" must be a number.");
            }
        });

        it("should return the provided value with no error when given 12", () => {
            assert.strictEqual(numberSpec.serialize(["this", "one", "works"], 12, {}), 12);
        });
    });
});