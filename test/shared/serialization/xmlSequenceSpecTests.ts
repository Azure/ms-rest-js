import { sequenceSpec } from "../../../lib/serialization/sequenceSpec";
import { SerializationOutputType } from "../../../lib/serialization/serializationOptions";
import { deserializeTest } from "./specTest";
import stringSpec from "../../../lib/serialization/stringSpec";

describe("sequenceSpec XML", () => {
  describe("deserialize()", () => {
    deserializeTest({
      testName: "deserialize a simple list",
      typeSpec: sequenceSpec(stringSpec),
      options: { outputType: SerializationOutputType.XML },
      value: ["a", "b", "c"],
      expectedResult: ["a", "b", "c"],
      expectedLogs: []
    });

    deserializeTest({
      testName: "deserialize a list of one element",
      typeSpec: sequenceSpec(stringSpec),
      options: { outputType: SerializationOutputType.XML },
      value: "a",
      expectedResult: ["a"],
      expectedLogs: []
    });

    deserializeTest({
      testName: "deserialize an empty list",
      typeSpec: sequenceSpec(stringSpec),
      options: { outputType: SerializationOutputType.XML },
      value: undefined,
      expectedResult: [],
      expectedLogs: []
    });
  });
});
