// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Options that can be passed to a serialize() function.
 */
export interface SerializationOptions {
  /**
   * The type of output that will be produced.
   */
  outputType?: SerializationOutputType;
}

/**
 * The different types of output that can be produced by serialization.
 */
export enum SerializationOutputType {
  JSON,
  XML
}