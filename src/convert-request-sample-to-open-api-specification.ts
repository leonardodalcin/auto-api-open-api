// import { OpenAPIV3 } from "openapi-types";
// import { groupRequestSamplesByURLAndMethod } from "./groupRequestSamplesByURLAndMethod";
// import { convertObjectArrayIntoJSONSchema } from "./convertObjectArrayIntoJSONSchema";
// import { IRequestSample } from "../interfaces/IRequestSample";
// import { format } from "prettier";
//
// export function convertGroupedRequestSamplesToOpenAPISpecification(
//     samples: ReturnType<typeof groupRequestSamplesByURLAndMethod>
// ): OpenAPIV3.Document {
//     const specification: OpenAPIV3.Document = {
//         openapi: "3.0.1",
//         info: { title: "api_pt", version: "1.0.0" },
//         servers: [
//             {
//                 url: "https://api.oiwarren.com",
//                 description: "production",
//             },
//         ],
//         paths: {},
//     };
//     const paths = Object.assign({}, samples);
//     for (let requestURL in paths) {
//         for (const requestMethod in paths[requestURL]) {
//             const requestSamples: IRequestSample[] = paths[requestURL][requestMethod];
//             specification.paths[requestURL] = {};
//             specification.paths[requestURL][requestMethod] = {
//                 requestBody: {
//                     content: {
//                         "application/json": {
//                             schema: convertObjectArrayIntoJSONSchema(
//                                 requestSamples.map((r) => r.requestBody)
//                             ),
//                         },
//                     },
//                 },
//             } as OpenAPIV3.OperationObject;
//             const codes = new Set(requestSamples.map((r) => r.statusCode));
//             specification.paths[requestURL][requestMethod].responses = {};
//             for (const code of codes.values()) {
//                 specification.paths[requestURL][requestMethod].responses[code] = {
//                     description: "",
//                     content: {
//                         "application/json": {
//                             schema: convertObjectArrayIntoJSONSchema(
//                                 requestSamples
//                                     .filter((r) => r.statusCode === code)
//                                     .map((r) => r.responseBody)
//                             ),
//                         },
//                     },
//                 };
//             }
//         }
//     }
//
//     return specification;
// }
