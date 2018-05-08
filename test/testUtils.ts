import { isNode } from "../lib/util/utils";

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Base URL for the ms-rest-js testserver.
 */
export const baseURL = (function() {
  if (isNode) {
    // parseInt just gives NaN (falsy) for undefined/null
    const port = parseInt(process.env.PORT!) || 3000;
    return `http://localhost:${port}`;
  } else {
    return "/";
  }
})();
