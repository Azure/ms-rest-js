// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as xml2js from "xml2js";

export function stringifyXML(obj: any, opts?: { rootName?: string }) {
  const builder = new xml2js.Builder({
    explicitArray: false,
    explicitCharkey: false,
    rootName: (opts || {}).rootName,
    renderOpts: {
      pretty: false
    }
  });
  return builder.buildObject(obj);
}

export function parseXML(str: string): Promise<any> {
  const xmlParser = new xml2js.Parser({
    explicitArray: false,
    explicitCharkey: false,
    explicitRoot: false
  });
  return new Promise((resolve, reject) => {
    xmlParser.parseString(str, (err?: Error, res?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
