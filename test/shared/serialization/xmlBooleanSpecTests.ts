// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import booleanSpec from "../../../lib/serialization/booleanSpec";
import { deserializeTest } from "./specTest";
import { SerializationOutputType } from "../../../lib/serialization/serializationOptions";

describe("booleanSpec XML", () => {
  describe("deserialize()", () => {
    deserializeTest({
      testName: "should deserialize true",
      typeSpec: booleanSpec,
      options: { outputType: SerializationOutputType.XML },
      value: "true",
      expectedResult: true
    });

    deserializeTest({
      testName: "should deserialize false",
      typeSpec: booleanSpec,
      options: { outputType: SerializationOutputType.XML },
      value: "false",
      expectedResult: false
    });

    deserializeTest({
      testName: "should deserialize a malformed boolean",
      typeSpec: booleanSpec,
      options: { outputType: SerializationOutputType.XML },
      value: "hello",
      expectedResult: "hello",
      expectedLogs: ['WARNING: Property a.property.path with value "hello" should be a boolean.']
    });
  });
});
