// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * The path to a property in both the deserialized and serialized scenarios.
 */
export class PropertyPath {
  public readonly path: string[];
  public readonly serializedPath: string[];
  constructor(path?: string[], serializedPath?: string[]) {
    this.path = path || [];
    this.serializedPath = serializedPath || this.path;
  }

  public get pathString(): string {
    return pathToString(this.path);
  }

  public get serializedPathString(): string {
    return pathToString(this.serializedPath);
  }

  public pathStringConcat(...path: string[]): PropertyPath {
    return new PropertyPath(this.path.concat(path));
  }

  public concat(path: string[], serializedPath?: string[]): PropertyPath {
    return new PropertyPath(this.path.concat(path), this.serializedPath.concat(serializedPath || path));
  }

  public toString(): string {
    const pathString: string = this.pathString;
    const serializedPathString: string = this.serializedPathString;
    return pathString + (pathString === serializedPathString ? "" : ` (${serializedPathString})`);
  }
}

function pathToString(path: string[]): string {
  return path.join(".");
}