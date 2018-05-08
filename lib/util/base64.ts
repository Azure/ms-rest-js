// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export function encodeString(value: string): string {
  if (typeof Buffer === "undefined") {
    return btoa(value);
  } else {
    return Buffer.from(value).toString("base64");
  }
}

export function encodeByteArray(value: Uint8Array): string {
if (typeof Buffer === "undefined") {
  return btoa(new TextDecoder().decode(value));
  } else {
    const bufferValue = (value instanceof Buffer) ? value : new Buffer(value);
    return bufferValue.toString("base64");
  }
}

export function decodeByteArray(value: string): Uint8Array {
  if (typeof Buffer === "undefined") {
    return new TextEncoder().encode(atob(value));
  } else {
    return Buffer.from(value, "base64");
  }
}
