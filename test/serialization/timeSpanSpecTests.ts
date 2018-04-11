// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import * as moment from "moment";
import timeSpanSpec from "../../lib/serialization/timeSpanSpec";

describe("timeSpanSpec", () => {
    it("should have \"TimeSpan\" for its typeName property", () => {
        assert.strictEqual("TimeSpan", timeSpanSpec.typeName);
    });

    describe("serialize()", () => {
        it("should throw an error when given undefined", () => {
            try {
                timeSpanSpec.serialize(["a", "property", "path"], undefined, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property a.property.path with value undefined must be a TimeSpan/Duration.");
            }
        });

        it("should throw an error when given false", () => {
            try {
                timeSpanSpec.serialize(["another", "property", "path"], false, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value false must be a TimeSpan/Duration.");
            }
        });

        it("should throw an error when given 5", () => {
            try {
                timeSpanSpec.serialize(["another", "property", "path"], 5, {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value 5 must be a TimeSpan/Duration.");
            }
        });

        it("should throw an error when given \"hello world!\"", () => {
            try {
                timeSpanSpec.serialize(["another", "property", "path"], "hello world!", {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value \"hello world!\" must be a TimeSpan/Duration.");
            }
        });

        it("should throw an error when given an ISO 8601 time span string", () => {
            try {
                timeSpanSpec.serialize(["another", "property", "path"], "P123DT22H14M12.011S", {});
                assert.fail("Expected an error to be thrown.");
            } catch (error) {
                assert.strictEqual(error.message, "Property another.property.path with value \"P123DT22H14M12.011S\" must be a TimeSpan/Duration.");
            }
        });

        it("should return the ISO 8601 string representation of the provided value with no error when given a moment.Duration", () => {
            assert.strictEqual(timeSpanSpec.serialize(["this", "one", "works"], moment.duration({ days: 123, hours: 22, minutes: 14, seconds: 12, milliseconds: 11 }), {}), "P123DT22H14M12.011S");
        });
    });
});