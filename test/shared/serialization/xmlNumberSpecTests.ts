// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import numberSpec from "../../../lib/serialization/numberSpec";
import { serializeTest, deserializeTest } from "./specTest";
import { SerializationOutputType } from "../../../lib/serialization/serializationOptions";

describe("numberSpec", () => {
  describe("serialize()", () => {
    serializeTest({
      testName: "serialize a number",
      typeSpec: numberSpec,
      options: { outputType: SerializationOutputType.XML },
      value: 42,
      expectedResult: 42,
      expectedLogs: []
    });
  });

  describe("deserialize()", () => {
    deserializeTest({
      testName: "deserialize a number",
      typeSpec: numberSpec,
      options: { outputType: SerializationOutputType.XML },
      value: "42",
      expectedResult: 42,
      expectedLogs: []
    });

    deserializeTest({
      testName: "deserialize a malformed number",
      typeSpec: numberSpec,
      options: { outputType: SerializationOutputType.XML },
      value: "hello",
      expectedResult: "hello",
      expectedLogs: ["WARNING: Property a.property.path with value \"hello\" should be a number."]
    });
  });
});
