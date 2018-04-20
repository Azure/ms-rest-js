// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import { PropertyPath } from "../../../lib/serialization/propertyPath";

describe("PropertyPath", () => {
  describe("constructor()", () => {
    it("with no arguments", () => {
      const path = new PropertyPath();
      assert.deepEqual(path.path, []);
      assert.deepEqual(path.serializedPath, []);
    });

    it("with one argument", () => {
      const path = new PropertyPath(["a", "b"]);
      assert.deepEqual(path.path, ["a", "b"]);
      assert.deepEqual(path.serializedPath, ["a", "b"]);
    });

    it("with two arguments", () => {
      const path = new PropertyPath(["a", "b"], ["a", "b", "c"]);
      assert.deepEqual(path.path, ["a", "b"]);
      assert.deepEqual(path.serializedPath, ["a", "b", "c"]);
    });
  });

  describe("pathStringConcat()", () => {
    it("with no arguments", () => {
      const path = new PropertyPath(["a"]);
      const concatPath: PropertyPath = path.pathStringConcat();
      assert.deepEqual(concatPath, path);
    });

    it("with one argument", () => {
      const path = new PropertyPath(["a"]);
      const concatPath: PropertyPath = path.pathStringConcat("b");
      assert.deepEqual(concatPath, new PropertyPath(["a", "b"]));
    });

    it("with two argument", () => {
      const path = new PropertyPath(["a"]);
      const concatPath: PropertyPath = path.pathStringConcat("b", "c");
      assert.deepEqual(concatPath, new PropertyPath(["a", "b", "c"]));
    });
  });

  describe("concat()", () => {
    it("with one empty array", () => {
      const path = new PropertyPath(["a"]);
      const concatPath: PropertyPath = path.concat([]);
      assert.deepEqual(concatPath, path);
    });

    it("with two empty arrays", () => {
      const path = new PropertyPath(["a"]);
      const concatPath: PropertyPath = path.concat([], []);
      assert.deepEqual(concatPath, path);
    });

    it("with one non-empty array", () => {
      const path = new PropertyPath(["a"]);
      const concatPath: PropertyPath = path.concat(["b"]);
      assert.deepEqual(concatPath, new PropertyPath(["a", "b"]));
    });

    it("with two non-empty equal arrays", () => {
      const path = new PropertyPath(["a"]);
      const concatPath: PropertyPath = path.concat(["b"], ["b"]);
      assert.deepEqual(concatPath, new PropertyPath(["a", "b"]));
    });

    it("with two non-empty non-equal arrays", () => {
      const path = new PropertyPath(["a"]);
      const concatPath: PropertyPath = path.concat(["b"], ["c"]);
      assert.deepEqual(concatPath, new PropertyPath(["a", "b"], ["a", "c"]));
    });
  });

  describe("toString()", () => {
    it("when path and serializedPath are equal", () => {
      assert.strictEqual("a.b", new PropertyPath(["a", "b"]).toString());
    });

    it("when path and serializedPath are different", () => {
      assert.strictEqual("a.b (a.b.c)", new PropertyPath(["a", "b"], ["a", "b", "c"]).toString());
    });
  });
});