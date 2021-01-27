"use strict";

import * as msRest from "../lib/msRest";
const clientOptions: msRest.ServiceClientOptions = {
  requestPolicyFactories: [msRest.logPolicy()]
};

const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"] || "subscriptionId";
// An easy way to get the token using Azure CLI (https://docs.microsoft.com/cli/azure/?view=azure-cli-latest)
// 1. `az login` using the above subscription
// 2. `az account set -s <subscription id>`
// 3. `az account get-access-token --resource=https://management.azure.com`
// 4. copy paste that token here. That token is valid for 1 hour
const token = process.env["ACCESS_TOKEN"] || "token";
const creds = new msRest.TokenCredentials(token);
const client = new msRest.ServiceClient(creds, clientOptions);
const req: msRest.RequestPrepareOptions = {
  url: `https://management.azure.com/subscriptions/${subscriptionId}/providers/Microsoft.Storage/storageAccounts?api-version=2015-06-15`,
  method: "GET"
};

client.sendRequest(req).then(function (res: msRest.HttpOperationResponse) {
  console.log(res.bodyAsText);
});

