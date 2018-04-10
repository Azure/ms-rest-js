// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import booleanSpec from "../../lib/serialization/booleanSpec";

describe("booleanSpec", () => {
    it("should have \"boolean\" for its typeName property", () => {
        assert.strictEqual("boolean", booleanSpec.typeName);
    });

    describe("serialize()", () => {
        it("should throw an error when given undefined", () => {
            try {
                booleanSpec.serialize(["a", "property", "path"], undefined);
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be of type boolean.");
            }
        });

        it("should throw an error when given 5", () => {
            try {
                booleanSpec.serialize(["another", "property", "path"], 5);
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value 5 must be of type boolean.");
            }
        });

        it("should return the provided value with no error when given true", () => {
            assert.strictEqual(booleanSpec.serialize(["this", "one", "works"], true), true);
        });
    });
});