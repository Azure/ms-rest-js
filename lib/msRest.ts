// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

// Credentials
import { TokenCredentials } from "./credentials/tokenCredentials";
import { BasicAuthenticationCredentials } from "./credentials/basicAuthenticationCredentials";
import { ApiKeyCredentials, ApiKeyCredentialOptions } from "./credentials/apiKeyCredentials";
import { ServiceClientCredentials } from "./credentials/serviceClientCredentials";

// HTTP Pipeline
import { FetchHttpClient } from "./fetchHttpClient";
import { HttpClient } from "./httpClient";
import { HttpHeaders, HttpHeader, RawHttpHeaders } from "./httpHeaders";
import { HttpMethod } from "./httpMethod";
import { HttpPipeline, DefaultHttpPipelineOptions, getDefaultHttpClient } from "./httpPipeline";
import { HttpPipelineLogger } from "./httpPipelineLogger";
import { HttpPipelineLogLevel } from "./httpPipelineLogLevel";
import { HttpPipelineOptions } from "./httpPipelineOptions";
import { HttpRequest } from "./httpRequest";
import { HttpResponse } from "./httpResponse";
import { InMemoryHttpResponse } from "./inMemoryHttpResponse";

// Request Policies
import { exponentialRetryPolicy } from "./policies/exponentialRetryPolicy";
import { generateClientRequestIdPolicy } from "./policies/generateClientRequestIdPolicy";
import { BaseRequestPolicy, RequestPolicy } from "./requestPolicy";
import { RequestPolicyFactory } from "./requestPolicyFactory";
import { RequestPolicyOptions } from "./requestPolicyOptions";
import { logPolicy } from "./policies/logPolicy";
import { msRestNodeJsUserAgentPolicy } from "./policies/msRestNodeJsUserAgentPolicy";
import { redirectPolicy } from "./policies/redirectPolicy";
import { rpRegistrationPolicy } from "./policies/rpRegistrationPolicy";
import { serializationPolicy } from "./policies/serializationPolicy";
import { signingPolicy } from "./policies/signingPolicy";
import { systemErrorRetryPolicy } from "./policies/systemErrorRetryPolicy";
import { userAgentPolicy } from "./policies/userAgentPolicy";

// Serialization
import base64UrlSpec from "./serialization/base64UrlSpec";
import booleanSpec from "./serialization/booleanSpec";
import byteArraySpec from "./serialization/byteArraySpec";
import { compositeSpec, CompositeType, CompositeTypeSpec } from "./serialization/compositeSpec";
import dateSpec from "./serialization/dateSpec";
import dateTimeRfc1123Spec from "./serialization/dateTimeRfc1123Spec";
import dateTimeSpec from "./serialization/dateTimeSpec";
import { dictionarySpec, DictionaryType, DictionaryTypeSpec } from "./serialization/dictionarySpec";
import { enumSpec, EnumTypeSpec } from "./serialization/enumSpec";
import numberSpec from "./serialization/numberSpec";
import objectSpec from "./serialization/objectSpec";
import { PropertyPath } from "./serialization/propertyPath";
import { sequenceSpec, SequenceTypeSpec } from "./serialization/sequenceSpec";
import { SerializationOptions } from "./serialization/serializationOptions";
import streamSpec from "./serialization/streamSpec";
import stringSpec from "./serialization/stringSpec";
import timeSpanSpec from "./serialization/timeSpanSpec";
import { TypeSpec } from "./serialization/typeSpec";
import unixTimeSpec from "./serialization/unixTimeSpec";
import uuidSpec from "./serialization/uuidSpec";

// Legacy
import { WebResource, RequestPrepareOptions, HttpMethods, ParameterValue, RequestOptionsBase } from "./webResource";
import { HttpOperationResponse } from "./httpOperationResponse";
import { RestError } from "./restError";
import { ServiceClient } from "./serviceClient";
import { Constants } from "./util/constants";
import { RequestPipeline, RequestFunction } from "./requestPipeline";
import { LogFilter } from "./filters/logFilter";
import { BaseFilter } from "./filters/baseFilter";
import { ExponentialRetryPolicyFilter } from "./filters/exponentialRetryPolicyFilter";
import { SystemErrorRetryPolicyFilter } from "./filters/systemErrorRetryPolicyFilter";
import { RedirectFilter } from "./filters/redirectFilter";
import { SigningFilter } from "./filters/signingFilter";
import { MsRestUserAgentFilter } from "./filters/msRestUserAgentFilter";
import {
  BaseMapperType, CompositeMapper, DictionaryMapper, EnumMapper, Mapper,
  MapperConstraints, MapperType, PolymorphicDiscriminator,
  SequenceMapper, Serializer, UrlParameterValue, serializeObject
} from "./serializer";
import {
  stripResponse, delay,
  executePromisesSequentially, generateUuid, encodeUri, ServiceCallback,
  promiseToCallback, promiseToServiceCallback, isValidUuid, dispatchRequest,
  applyMixins, isNode, stringifyXML, prepareXMLRootList
} from "./util/utils";
import * as isStream from "is-stream";

export {
  // Credentials
  BasicAuthenticationCredentials, ApiKeyCredentials, ApiKeyCredentialOptions, TokenCredentials,

  // HTTP Pipeline
  FetchHttpClient, HttpClient, HttpHeaders, HttpHeader, RawHttpHeaders, HttpMethod,
  HttpPipeline, DefaultHttpPipelineOptions, HttpPipelineLogger, HttpPipelineLogLevel,
  HttpPipelineOptions, HttpRequest, HttpResponse, InMemoryHttpResponse, getDefaultHttpClient,

  // Request Policies
  BaseRequestPolicy, RequestPolicy, RequestPolicyFactory, RequestPolicyOptions,
  exponentialRetryPolicy, generateClientRequestIdPolicy, logPolicy, msRestNodeJsUserAgentPolicy,
  redirectPolicy, rpRegistrationPolicy, serializationPolicy, signingPolicy, systemErrorRetryPolicy,
  userAgentPolicy,

  // Serialization
  base64UrlSpec, booleanSpec, byteArraySpec, compositeSpec, CompositeType, CompositeTypeSpec,
  dateSpec, dateTimeRfc1123Spec, dateTimeSpec, dictionarySpec, DictionaryType, DictionaryTypeSpec,
  enumSpec, EnumTypeSpec, numberSpec, objectSpec, PropertyPath, sequenceSpec, SequenceTypeSpec,
  SerializationOptions, streamSpec, stringSpec, timeSpanSpec, TypeSpec, unixTimeSpec, uuidSpec,

  // Legacy
  BaseMapperType, CompositeMapper, DictionaryMapper, EnumMapper, Mapper, MapperConstraints, MapperType,
  PolymorphicDiscriminator, SequenceMapper, UrlParameterValue, Serializer, serializeObject,
  WebResource, RequestPrepareOptions, HttpMethods, ParameterValue, HttpOperationResponse, ServiceClient, Constants, RequestPipeline,
  ServiceClientCredentials, BaseFilter, LogFilter, ExponentialRetryPolicyFilter,
  SystemErrorRetryPolicyFilter, SigningFilter, MsRestUserAgentFilter, stripResponse, delay, executePromisesSequentially,
  generateUuid, isValidUuid, encodeUri, RestError, RequestOptionsBase, RequestFunction, ServiceCallback, promiseToCallback,
  promiseToServiceCallback, isStream, dispatchRequest, RedirectFilter, applyMixins, isNode, stringifyXML, prepareXMLRootList
};
