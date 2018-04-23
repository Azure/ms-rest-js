// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.
import * as assert from "assert";
import booleanSpec from "../../../lib/serialization/booleanSpec";
import { CompositeType, CompositeTypeSpec, compositeSpec } from "../../../lib/serialization/compositeSpec";
import numberSpec from "../../../lib/serialization/numberSpec";
import { sequenceSpec } from "../../../lib/serialization/sequenceSpec";
import { SerializationOptions, SerializationOutputType } from "../../../lib/serialization/serializationOptions";
import stringSpec from "../../../lib/serialization/stringSpec";
import { deserializeTest, serializeTest } from "./specTest";

describe("compositeSpec", () => {
  it("should have \"Composite\" for its specType property", () => {
    assert.strictEqual("Composite", compositeSpec({ typeName: "Spam", propertySpecs: {} }).specType);
  });

  it("should have the correct typeName property", () => {
    assert.strictEqual("Spam", compositeSpec({ typeName: "Spam", propertySpecs: {} }).typeName);
  });

  const jsonFlattenableType: CompositeTypeSpec = compositeSpec({
    typeName: "Spam",
    propertySpecs: {
      "a": {
        serializedName: "A.B.C",
        valueSpec: numberSpec
      },
      "b": {
        serializedName: "A.B.D",
        valueSpec: sequenceSpec(booleanSpec)
      },
      "c": {
        serializedName: "A.E",
        valueSpec: stringSpec
      }
    }
  });

  const xmlFlattenableType: CompositeTypeSpec = compositeSpec({
    typeName: "Spam",
    propertySpecs: {
      "a": {
        xmlIsAttribute: true,
        xmlName: "A",
        valueSpec: numberSpec
      },
      "b": {
        xmlIsWrapped: true,
        xmlElementName: "bool",
        xmlName: "b.o.o.l.s",
        valueSpec: sequenceSpec(booleanSpec)
      },
      "c": {
        xmlName: "A.E",
        valueSpec: stringSpec
      }
    }
  });

  const xmlWithWrappedSequence: CompositeTypeSpec = compositeSpec({
    typeName: "Spam",
    propertySpecs: {
      "a": {
        xmlIsAttribute: true,
        xmlName: "a",
        valueSpec: numberSpec
      },
      "b": {
        xmlIsWrapped: true,
        xmlElementName: "bool",
        xmlName: "bools",
        valueSpec: sequenceSpec(booleanSpec)
      },
      "c": {
        xmlName: "spam",
        valueSpec: stringSpec
      }
    }
  });

  const tree: CompositeTypeSpec = compositeSpec({
    typeName: "Tree",
    propertySpecs: {
      name: {
        required: true,
        valueSpec: stringSpec
      },
      children: {
        valueSpec: sequenceSpec("Tree")
      }
    }
  });

  const animal: CompositeTypeSpec = compositeSpec({
    typeName: "Animal",
    polymorphism: {
      inheritedBy: {
        derivedTypes: [
          {
            derivedTypeSpec: "Cat",
            discriminatorPropertyValue: "cat"
          }
        ],
        discriminatorPropertyName: "animalType",
        discriminatorPropertyValue: "animal"
      }
    },
    propertySpecs: {
      animalType: {
        required: true,
        valueSpec: stringSpec
      },
      ageInYears: {
        required: true,
        valueSpec: numberSpec
      }
    }
  });

  const cat: CompositeTypeSpec = compositeSpec({
    typeName: "Cat",
    polymorphism: {
      inheritsFrom: animal,
      inheritedBy: {
        derivedTypes: [
          {
            derivedTypeSpec: "Tiger",
            discriminatorPropertyValue: "tiger"
          }
        ],
        discriminatorPropertyName: "animalType",
        discriminatorPropertyValue: "cat"
      }
    },
    propertySpecs: {
      cuddly: {
        required: true,
        valueSpec: booleanSpec
      }
    }
  });

  const tiger: CompositeTypeSpec = compositeSpec({
    typeName: "Tiger",
    polymorphism: {
      // This is just to make sure that a diamond inheritance model works.
      inheritsFrom: [cat, animal],
      inheritedBy: {
        derivedTypes: [
          {
            derivedTypeSpec: "Saber-toothed Tiger",
            discriminatorPropertyValue: "saber"
          }
        ],
        discriminatorPropertyName: "toothType",
        discriminatorPropertyValue: "sharp"
      }
    },
    propertySpecs: {
      stripes: {
        required: true,
        valueSpec: numberSpec
      },
      toothType: {
        required: true,
        valueSpec: stringSpec
      }
    }
  });

  const saberToothedTiger: CompositeTypeSpec = compositeSpec({
    typeName: "Saber-toothed Tiger",
    polymorphism: {
      inheritsFrom: [tiger]
    }
  });

  const animalCompositeSpecDictionary: { [typeName: string]: CompositeTypeSpec } = {
    Animal: animal,
    Cat: cat,
    Tiger: tiger,
    "Saber-toothed Tiger": saberToothedTiger
  };

  describe("serialize()", () => {
    describe("with strict type-checking", () => {
      function compositeSerializeWithStrictTypeCheckingTest(args: { testName?: string, compositeSpec?: CompositeTypeSpec, propertyPath?: string[], value: CompositeType, options?: SerializationOptions, expectedResult: CompositeType | Error, expectedLogs?: string[] }): void {
        const options: SerializationOptions = args.options || {};
        options.serializationStrictTypeChecking = true;

        serializeTest({
          testName: args.testName,
          typeSpec: args.compositeSpec || compositeSpec({ typeName: "Spam", propertySpecs: {} }),
          propertyPath: args.propertyPath,
          options: options,
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      compositeSerializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an object.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an object.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        value: [] as any,
        expectedResult: new Error("Property a.property.path with value [] must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be an object.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should log a warning when a required property is missing and strict missing properties is false`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } } }),
        value: {},
        options: {
          serializationStrictMissingProperties: false
        },
        expectedResult: {},
        expectedLogs: [`WARNING: Missing non-constant boolean property at a.property.path.tasty?.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should throw an error when a required property is missing and strict missing properties is true`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } } }),
        value: {},
        options: {
          serializationStrictMissingProperties: true
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.tasty?."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.tasty?.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should throw an error when a property has the wrong type`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { valueSpec: booleanSpec } } }),
        value: { "tasty?": 2 },
        expectedResult: new Error("Property a.property.path.tasty? with value 2 must be a boolean."),
        expectedLogs: [`ERROR: Property a.property.path.tasty? with value 2 must be a boolean.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should drop properties that exist on the value but not in the specification`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "age": { valueSpec: numberSpec } } }),
        value: { "age": 30, "height": "tall" },
        expectedResult: { "age": 30 }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should return the correct flattened serialization for JSON`,
        compositeSpec: jsonFlattenableType,
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        expectedResult: {
          "A": {
            "B": {
              "C": 5,
              "D": [true, false, true]
            },
            "E": "test"
          }
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should return the correct XML serialization`,
        compositeSpec: xmlWithWrappedSequence,
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          $: {
            "a": 5
          },
          "bools": {
            "bool": [true, false, true]
          },
          "spam": "test"
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for XML",
        compositeSpec: xmlFlattenableType,
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "$": {
            "A": 5
          },
          "b": {
            "o": {
              "o": {
                "l": {
                  "s": {
                    "bool": [true, false, true]
                  }
                }
              }
            }
          },
          "A": {
            "E": "test"
          }
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: `should support recursive specs in JSON`,
        compositeSpec: tree,
        value: {
          name: "A",
          children: [
            {
              name: "B",
              children: [
                {
                  name: "C"
                }
              ]
            }
          ]
        },
        options: {
          compositeSpecDictionary: {
            "Tree": tree
          }
        },
        expectedResult: {
          name: "A",
          children: [
            {
              name: "B",
              children: [
                {
                  name: "C"
                }
              ]
            }
          ]
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when a composite spec reference doesn't exist in composite spec dictionary",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "A": {
              valueSpec: "B"
            }
          }
        }),
        value: {
          "A": "B doesn't exist in the composite TypeSpec dictionary"
        },
        expectedResult: new Error(`Missing composite specification entry in composite type dictionary for type named "B" at a.property.path.A.`),
        expectedLogs: [`ERROR: Missing composite specification entry in composite type dictionary for type named "B" at a.property.path.A.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value is missing property in base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.ageInYears."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.ageInYears.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value is missing property in derived type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.cuddly."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.cuddly.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is missing property in base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.ageInYears."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.ageInYears.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is missing property in derived type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: 12
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.cuddly."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.cuddly.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value has wrong type for base type property",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedResult: new Error(`Property a.property.path.ageInYears with value "12" must be a number.`),
        expectedLogs: [`ERROR: Property a.property.path.ageInYears with value "12" must be a number.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value has wrong type for derived type property",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: 10
        },
        expectedResult: new Error(`Property a.property.path.cuddly with value 10 must be a boolean.`),
        expectedLogs: [`ERROR: Property a.property.path.cuddly with value 10 must be a boolean.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value has wrong type for base type property",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedResult: new Error(`Property a.property.path.ageInYears with value "12" must be a number.`),
        expectedLogs: [`ERROR: Property a.property.path.ageInYears with value "12" must be a number.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is has wrong type for derived type property",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: "definitely"
        },
        expectedResult: new Error(`Property a.property.path.cuddly with value "definitely" must be a boolean.`),
        expectedLogs: [`ERROR: Property a.property.path.cuddly with value "definitely" must be a boolean.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should support serializing base type when composite spec is base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "animal",
          ageInYears: 12
        },
        expectedResult: {
          animalType: "animal",
          ageInYears: 12
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should support serializing derived type when composite spec is base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: false
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: false
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should support serializing 2nd-level derived type when composite spec is base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          ageInYears: 12,
          cuddly: false,
          stripes: 43,
          toothType: "sharp"
        },
        expectedResult: {
          animalType: "tiger",
          ageInYears: 12,
          cuddly: false,
          stripes: 43,
          toothType: "sharp"
        }
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error with unrecognized polymorphic discriminator value",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "terrifying",
          ageInYears: 12,
          cuddly: true
        },
        expectedResult: new Error(`Unrecognized polymorphic discriminator value terrifying for composite type Tiger at property a.property.path.toothType.`),
        expectedLogs: [`ERROR: Unrecognized polymorphic discriminator value terrifying for composite type Tiger at property a.property.path.toothType.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when missing a required property of a 2nd-level derived type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          ageInYears: 12,
          cuddly: true,
          toothType: "sharp"
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.stripes."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.stripes.`]
      });

      compositeSerializeWithStrictTypeCheckingTest({
        testName: "should support 3rd-level derived types with multiple discriminator properties",
        options: {
          serializationStrictMissingProperties: true,
          serializationStrictAllowedProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        },
        expectedResult: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        }
      });
    });

    describe("without strict type-checking", () => {
      function compositeSerializeWithoutStrictTypeCheckingTest(args: { testName?: string, compositeSpec?: CompositeTypeSpec, propertyPath?: string[], value: CompositeType, options?: SerializationOptions, expectedResult: CompositeType | Error, expectedLogs?: string[] }): void {
        const options: SerializationOptions = args.options || {};
        options.serializationStrictTypeChecking = false;

        serializeTest({
          testName: args.testName,
          typeSpec: args.compositeSpec || compositeSpec({ typeName: "Spam", propertySpecs: {} }),
          propertyPath: args.propertyPath,
          options: options,
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      compositeSerializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an object.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an object.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        value: [],
        expectedResult: [],
        expectedLogs: [`WARNING: Property a.property.path with value [] should be an object.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should log a warning when a required property is missing and strict missing properties is false`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } } }),
        value: {},
        options: {
          serializationStrictMissingProperties: false
        },
        expectedResult: {},
        expectedLogs: [`WARNING: Missing non-constant boolean property at a.property.path.tasty?.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should throw an error when a required property is missing and strict missing properties is true`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } } }),
        value: {},
        options: {
          serializationStrictMissingProperties: true
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.tasty?."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.tasty?.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should throw an error when a property has the wrong type`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { valueSpec: booleanSpec } } }),
        value: { "tasty?": 2 },
        expectedResult: { "tasty?": 2 },
        expectedLogs: [`WARNING: Property a.property.path.tasty? with value 2 should be a boolean.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should drop properties that exist on the value but not in the specification`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "age": { valueSpec: numberSpec } } }),
        value: { "age": 30, "height": "tall" },
        expectedResult: { "age": 30 }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should return the correct flattened serialization for JSON`,
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "a": {
              serializedName: "A.B.C",
              valueSpec: numberSpec
            },
            "b": {
              serializedName: "A.B.D",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              serializedName: "A.E",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        expectedResult: {
          "A": {
            "B": {
              "C": 5,
              "D": [true, false, true]
            },
            "E": "test"
          }
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should return the correct XML serialization`,
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "a": {
              xmlIsAttribute: true,
              xmlName: "a",
              valueSpec: numberSpec
            },
            "b": {
              xmlIsWrapped: true,
              xmlElementName: "bool",
              xmlName: "bools",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              xmlName: "spam",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          $: {
            "a": 5
          },
          "bools": {
            "bool": [true, false, true]
          },
          "spam": "test"
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for XML",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "a": {
              xmlIsAttribute: true,
              xmlName: "A",
              valueSpec: numberSpec
            },
            "b": {
              xmlIsWrapped: true,
              xmlElementName: "bool",
              xmlName: "b.o.o.l.s",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              xmlName: "A.E",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "$": {
            "A": 5
          },
          "b": {
            "o": {
              "o": {
                "l": {
                  "s": {
                    "bool": [true, false, true]
                  }
                }
              }
            }
          },
          "A": {
            "E": "test"
          }
        }
      });

      const recursiveCompositeSpec = compositeSpec({
        typeName: "Letters",
        propertySpecs: {
          "A": {
            valueSpec: stringSpec
          },
          "B": {
            valueSpec: "Letters"
          }
        }
      });
      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: `should support recursive specs in JSON`,
        compositeSpec: recursiveCompositeSpec,
        value: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        },
        options: {
          compositeSpecDictionary: {
            "Letters": recursiveCompositeSpec
          }
        },
        expectedResult: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when a composite spec reference doesn't exist in composite spec dictionary",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "A": {
              valueSpec: "B"
            }
          }
        }),
        value: {
          "A": "B doesn't exist in the composite TypeSpec dictionary"
        },
        expectedResult: new Error(`Missing composite specification entry in composite type dictionary for type named "B" at a.property.path.A.`),
        expectedLogs: [`ERROR: Missing composite specification entry in composite type dictionary for type named "B" at a.property.path.A.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value is missing property in base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.ageInYears."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.ageInYears.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value is missing property in derived type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.cuddly."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.cuddly.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is missing property in base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.ageInYears."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.ageInYears.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is missing property in derived type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: 12
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.cuddly."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.cuddly.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log a warning when the composite spec is base type and value has wrong type for base type property",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedLogs: [`WARNING: Property a.property.path.ageInYears with value "12" should be a number.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log a warning when the composite spec is base type and value has wrong type for derived type property",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: 10
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: 10
        },
        expectedLogs: [`WARNING: Property a.property.path.cuddly with value 10 should be a boolean.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log a warning when the composite spec is derived type and value has wrong type for base type property",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedLogs: [`WARNING: Property a.property.path.ageInYears with value "12" should be a number.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log a warning when the composite spec is derived type and value is has wrong type for derived type property",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: "definitely"
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: "definitely"
        },
        expectedLogs: [`WARNING: Property a.property.path.cuddly with value "definitely" should be a boolean.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should support serializing base type when composite spec is base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "animal",
          ageInYears: 12
        },
        expectedResult: {
          animalType: "animal",
          ageInYears: 12
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should support serializing derived type when composite spec is base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: false
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: false
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should support serializing 2nd-level derived type when composite spec is base type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: false,
          stripes: 43
        },
        expectedResult: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: false,
          stripes: 43
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error with unrecognized polymorphic discriminator value",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "terrifying",
          ageInYears: 12,
          cuddly: true
        },
        expectedResult: new Error(`Unrecognized polymorphic discriminator value terrifying for composite type Tiger at property a.property.path.toothType.`),
        expectedLogs: [`ERROR: Unrecognized polymorphic discriminator value terrifying for composite type Tiger at property a.property.path.toothType.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when missing a required property of a 2nd-level derived type",
        options: {
          serializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.stripes."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.stripes.`]
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should support 3rd-level derived types with multiple discriminator properties",
        options: {
          serializationStrictMissingProperties: true,
          serializationStrictAllowedProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        },
        expectedResult: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        }
      });

      compositeSerializeWithoutStrictTypeCheckingTest({
        testName: "should support 3rd-level derived types with multiple discriminator properties",
        options: {
          serializationStrictMissingProperties: true,
          serializationStrictAllowedProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        },
        expectedResult: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        }
      });
    });
  });

  describe("deserialize()", () => {
    describe("with strict type-checking", () => {
      function compositeDeserializeWithStrictTypeCheckingTest(args: { testName?: string, compositeSpec?: CompositeTypeSpec, propertyPath?: string[], value: CompositeType, options?: SerializationOptions, expectedResult: CompositeType | Error, expectedLogs?: string[] }): void {
        const options: SerializationOptions = args.options || {};
        options.deserializationStrictTypeChecking = true;

        deserializeTest({
          testName: args.testName,
          typeSpec: args.compositeSpec || compositeSpec({ typeName: "Spam", propertySpecs: {} }),
          propertyPath: args.propertyPath,
          options: options,
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      compositeDeserializeWithStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: new Error("Property a.property.path with value undefined must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value undefined must be an object.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        value: false as any,
        expectedResult: new Error("Property a.property.path with value false must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value false must be an object.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        value: [],
        expectedResult: new Error("Property a.property.path with value [] must be an object."),
        expectedLogs: [`ERROR: Property a.property.path with value [] must be an object.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: `should log a warning when a required property is missing and strict missing properties is false`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } } }),
        value: {},
        options: {
          deserializationStrictMissingProperties: false
        },
        expectedResult: {},
        expectedLogs: [`WARNING: Missing non-constant boolean property at a.property.path.tasty?.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: `should throw an error when a required property is missing and strict missing properties is true`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } } }),
        value: {},
        options: {
          deserializationStrictMissingProperties: true
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.tasty?."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.tasty?.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should throw an error when the value has a property with the wrong type",
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { valueSpec: booleanSpec } } }),
        value: { "tasty?": 2 },
        expectedResult: new Error("Property a.property.path.tasty? with value 2 must be a boolean."),
        expectedLogs: [`ERROR: Property a.property.path.tasty? with value 2 must be a boolean.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should return the provided value without properties not in the property specification",
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "age": { valueSpec: numberSpec } } }),
        value: { "height": "tall", "age": 30 },
        expectedResult: { "age": 30 }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for JSON",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "a": {
              serializedName: "A.B.C",
              valueSpec: numberSpec
            },
            "b": {
              serializedName: "A.B.D",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              serializedName: "A.E",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          "A": {
            "B": {
              "C": 5,
              "D": [true, false, true]
            },
            "E": "test"
          }
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should return the correct XML serialization",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "a": {
              xmlIsAttribute: true,
              xmlName: "a",
              valueSpec: numberSpec
            },
            "b": {
              xmlIsWrapped: true,
              xmlElementName: "bool",
              xmlName: "bools",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              xmlName: "spam",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          $: {
            "a": 5
          },
          "bools": {
            "bool": [true, false, true]
          },
          "spam": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for XML",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "a": {
              xmlIsAttribute: true,
              xmlName: "A",
              valueSpec: numberSpec
            },
            "b": {
              xmlIsWrapped: true,
              xmlElementName: "bool",
              xmlName: "b.o.o.l.s",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              xmlName: "A.E",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          "$": {
            "A": 5
          },
          "b": {
            "o": {
              "o": {
                "l": {
                  "s": {
                    "bool": [true, false, true]
                  }
                }
              }
            }
          },
          "A": {
            "E": "test"
          }
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      const recursiveCompositeSpec = compositeSpec({
        typeName: "Letters",
        propertySpecs: {
          "A": {
            valueSpec: stringSpec
          },
          "B": {
            valueSpec: "Letters"
          }
        }
      });
      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should support recursive specs in JSON",
        compositeSpec: recursiveCompositeSpec,
        value: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        },
        options: {
          compositeSpecDictionary: {
            "Letters": recursiveCompositeSpec
          }
        },
        expectedResult: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when a composite spec reference doesn't exist in composite spec dictionary",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "A": {
              valueSpec: "B"
            }
          }
        }),
        value: {
          "A": "B doesn't exist in the composite TypeSpec dictionary"
        },
        expectedResult: new Error(`Missing composite specification entry in composite type dictionary for type named "B" at a.property.path.A.`),
        expectedLogs: [`ERROR: Missing composite specification entry in composite type dictionary for type named "B" at a.property.path.A.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value is missing property in base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.ageInYears."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.ageInYears.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value is missing property in derived type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.cuddly."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.cuddly.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is missing property in base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.ageInYears."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.ageInYears.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is missing property in derived type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: 12
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.cuddly."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.cuddly.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value has wrong type for base type property",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedResult: new Error(`Property a.property.path.ageInYears with value "12" must be a number.`),
        expectedLogs: [`ERROR: Property a.property.path.ageInYears with value "12" must be a number.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value has wrong type for derived type property",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: 10
        },
        expectedResult: new Error(`Property a.property.path.cuddly with value 10 must be a boolean.`),
        expectedLogs: [`ERROR: Property a.property.path.cuddly with value 10 must be a boolean.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value has wrong type for base type property",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedResult: new Error(`Property a.property.path.ageInYears with value "12" must be a number.`),
        expectedLogs: [`ERROR: Property a.property.path.ageInYears with value "12" must be a number.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is has wrong type for derived type property",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: "definitely"
        },
        expectedResult: new Error(`Property a.property.path.cuddly with value "definitely" must be a boolean.`),
        expectedLogs: [`ERROR: Property a.property.path.cuddly with value "definitely" must be a boolean.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should support serializing base type when composite spec is base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "animal",
          ageInYears: 12
        },
        expectedResult: {
          animalType: "animal",
          ageInYears: 12
        }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should support serializing derived type when composite spec is base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: false
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: false
        }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should support serializing 2nd-level derived type when composite spec is base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: false,
          stripes: 43
        },
        expectedResult: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: false,
          stripes: 43
        }
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should log and throw an error when missing a required property of a 2nd-level derived type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.stripes."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.stripes.`]
      });

      compositeDeserializeWithStrictTypeCheckingTest({
        testName: "should support 3rd-level derived types with multiple discriminator properties",
        options: {
          deserializationStrictMissingProperties: true,
          deserializationStrictAllowedProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        },
        expectedResult: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        }
      });
    });

    describe("without strict type-checking", () => {
      function compositeDeserializeWithoutStrictTypeCheckingTest(args: { testName?: string, compositeSpec?: CompositeTypeSpec, propertyPath?: string[], value: CompositeType, options?: SerializationOptions, expectedResult: CompositeType | Error, expectedLogs?: string[] }): void {
        const options: SerializationOptions = args.options || {};
        options.deserializationStrictTypeChecking = false;

        deserializeTest({
          testName: args.testName,
          typeSpec: args.compositeSpec || compositeSpec({ typeName: "Spam", propertySpecs: {} }),
          propertyPath: args.propertyPath,
          options: options,
          value: args.value,
          expectedResult: args.expectedResult,
          expectedLogs: args.expectedLogs
        });
      }

      compositeDeserializeWithoutStrictTypeCheckingTest({
        value: undefined as any,
        expectedResult: undefined as any,
        expectedLogs: [`WARNING: Property a.property.path with value undefined should be an object.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        value: false as any,
        expectedResult: false as any,
        expectedLogs: [`WARNING: Property a.property.path with value false should be an object.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        value: [],
        expectedResult: [],
        expectedLogs: [`WARNING: Property a.property.path with value [] should be an object.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        value: {},
        expectedResult: {}
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: `should log a warning when a required property is missing and strict missing properties is false`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } } }),
        value: {},
        options: {
          deserializationStrictMissingProperties: false
        },
        expectedResult: {},
        expectedLogs: [`WARNING: Missing non-constant boolean property at a.property.path.tasty?.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: `should throw an error when a required property is missing and strict missing properties is true`,
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { required: true, valueSpec: booleanSpec } } }),
        value: {},
        options: {
          deserializationStrictMissingProperties: true
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.tasty?."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.tasty?.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should throw an error when the value has a property with the wrong type",
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "tasty?": { valueSpec: booleanSpec } } }),
        value: { "tasty?": 2 },
        expectedResult: { "tasty?": 2 },
        expectedLogs: [`WARNING: Property a.property.path.tasty? with value 2 should be a boolean.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should return the provided value without properties not in the property specification",
        compositeSpec: compositeSpec({ typeName: "Spam", propertySpecs: { "age": { valueSpec: numberSpec } } }),
        value: { "height": "tall", "age": 30 },
        expectedResult: { "age": 30 }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for JSON",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "a": {
              serializedName: "A.B.C",
              valueSpec: numberSpec
            },
            "b": {
              serializedName: "A.B.D",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              serializedName: "A.E",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          "A": {
            "B": {
              "C": 5,
              "D": [true, false, true]
            },
            "E": "test"
          }
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should return the correct XML serialization",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "a": {
              xmlIsAttribute: true,
              xmlName: "a",
              valueSpec: numberSpec
            },
            "b": {
              xmlIsWrapped: true,
              xmlElementName: "bool",
              xmlName: "bools",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              xmlName: "spam",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          $: {
            "a": 5
          },
          "bools": {
            "bool": [true, false, true]
          },
          "spam": "test"
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should return the correct flattened serialization for XML",
        compositeSpec: compositeSpec({
          typeName: "Spam", propertySpecs: {
            "a": {
              xmlIsAttribute: true,
              xmlName: "A",
              valueSpec: numberSpec
            },
            "b": {
              xmlIsWrapped: true,
              xmlElementName: "bool",
              xmlName: "b.o.o.l.s",
              valueSpec: sequenceSpec(booleanSpec)
            },
            "c": {
              xmlName: "A.E",
              valueSpec: stringSpec
            }
          }
        }),
        value: {
          "$": {
            "A": 5
          },
          "b": {
            "o": {
              "o": {
                "l": {
                  "s": {
                    "bool": [true, false, true]
                  }
                }
              }
            }
          },
          "A": {
            "E": "test"
          }
        },
        options: {
          outputType: SerializationOutputType.XML
        },
        expectedResult: {
          "a": 5,
          "b": [true, false, true],
          "c": "test"
        }
      });

      const recursiveCompositeSpec = compositeSpec({
        typeName: "Letters",
        propertySpecs: {
          "A": {
            valueSpec: stringSpec
          },
          "B": {
            valueSpec: "Letters"
          }
        }
      });
      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should support recursive specs in JSON",
        compositeSpec: recursiveCompositeSpec,
        value: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        },
        options: {
          compositeSpecDictionary: {
            "Letters": recursiveCompositeSpec
          }
        },
        expectedResult: {
          "A": "a",
          "B": {
            "B": {
              "A": "aaa"
            }
          }
        }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when a composite spec reference doesn't exist in composite spec dictionary",
        compositeSpec: compositeSpec({
          typeName: "Spam",
          propertySpecs: {
            "A": {
              valueSpec: "B"
            }
          }
        }),
        value: {
          "A": "B doesn't exist in the composite TypeSpec dictionary"
        },
        expectedResult: new Error(`Missing composite specification entry in composite type dictionary for type named "B" at a.property.path.A.`),
        expectedLogs: [`ERROR: Missing composite specification entry in composite type dictionary for type named "B" at a.property.path.A.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value is missing property in base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.ageInYears."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.ageInYears.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is base type and value is missing property in derived type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.cuddly."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.cuddly.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is missing property in base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.ageInYears."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.ageInYears.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when the composite spec is derived type and value is missing property in derived type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: 12
        },
        expectedResult: new Error("Missing non-constant boolean property at a.property.path.cuddly."),
        expectedLogs: [`ERROR: Missing non-constant boolean property at a.property.path.cuddly.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log a warning when the composite spec is base type and value has wrong type for base type property",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedLogs: [`WARNING: Property a.property.path.ageInYears with value "12" should be a number.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log a warning when the composite spec is base type and value has wrong type for derived type property",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: 10
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: 10
        },
        expectedLogs: [`WARNING: Property a.property.path.cuddly with value 10 should be a boolean.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log a warning when the composite spec is derived type and value has wrong type for base type property",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: "12",
          cuddly: true
        },
        expectedLogs: [`WARNING: Property a.property.path.ageInYears with value "12" should be a number.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log a warning when the composite spec is derived type and value is has wrong type for derived type property",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: cat,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: "definitely"
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: "definitely"
        },
        expectedLogs: [`WARNING: Property a.property.path.cuddly with value "definitely" should be a boolean.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should support serializing base type when composite spec is base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "animal",
          ageInYears: 12
        },
        expectedResult: {
          animalType: "animal",
          ageInYears: 12
        }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should support serializing derived type when composite spec is base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: false
        },
        expectedResult: {
          animalType: "cat",
          ageInYears: 12,
          cuddly: false
        }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should support serializing 2nd-level derived type when composite spec is base type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: false,
          stripes: 43
        },
        expectedResult: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: false,
          stripes: 43
        }
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should log and throw an error when missing a required property of a 2nd-level derived type",
        options: {
          deserializationStrictMissingProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "sharp",
          ageInYears: 12,
          cuddly: true
        },
        expectedResult: new Error("Missing non-constant number property at a.property.path.stripes."),
        expectedLogs: [`ERROR: Missing non-constant number property at a.property.path.stripes.`]
      });

      compositeDeserializeWithoutStrictTypeCheckingTest({
        testName: "should support 3rd-level derived types with multiple discriminator properties",
        options: {
          deserializationStrictMissingProperties: true,
          deserializationStrictAllowedProperties: true,
          compositeSpecDictionary: animalCompositeSpecDictionary
        },
        compositeSpec: animal,
        value: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        },
        expectedResult: {
          animalType: "tiger",
          toothType: "saber",
          stripes: 12,
          ageInYears: 10000,
          cuddly: false
        }
      });
    });
  });
});
