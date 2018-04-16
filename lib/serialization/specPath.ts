// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class SpecPath {
  public readonly serializedPath: string[];
  constructor(public readonly path: string[], _serializedPath?: string[]) {
    this.serializedPath = _serializedPath || this.path;
  }

  public get pathString(): string {
    return pathToString(this.path);
  }

  public get serializedPathString(): string {
    return pathToString(this.serializedPath);
  }

  public pathStringConcat(...path: string[]): SpecPath {
    return new SpecPath(this.path.concat(path));
  }

  public concat(path: string[], serializedPath?: string[]): SpecPath {
    return new SpecPath(this.path.concat(path), this.serializedPath.concat(serializedPath || path));
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