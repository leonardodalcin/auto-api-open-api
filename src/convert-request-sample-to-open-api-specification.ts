import { OpenAPIV3 } from "openapi-types";
import type { APISample } from "./types/api-sample";
import type { RequestSample } from "./types/request-sample";
import { convertObjectArrayIntoJSONSchema } from "./convert-object-array-to-json-schema";

function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups: { [key: string]: T[] } = {};
  for (const item of items) {
    (groups[key(item)] = groups[key(item)] ?? []).push(item);
  }
  return groups;
}

function parseJSONBodies(bodies: (string | undefined)[]): unknown[] {
  const parsed: unknown[] = [];
  for (const body of bodies) {
    if (!body) continue;
    try {
      parsed.push(JSON.parse(body));
    } catch {
      // skip bodies that are not JSON
    }
  }
  return parsed;
}

function convertValuesToSchema(values: unknown[]): OpenAPIV3.SchemaObject {
  // generate-schema drops the items of nested arrays, so array bodies are
  // described from all their elements together
  if (values.length && values.every(Array.isArray)) {
    return { type: "array", items: convertValuesToSchema(values.flat()) };
  }
  // the generated schema describes the array of samples, we want its items
  const { items } = convertObjectArrayIntoJSONSchema(values) as {
    items?: OpenAPIV3.SchemaObject;
  };
  // empty arrays carry no information about their items
  return items ?? {};
}

// returns undefined when none of the samples has a JSON body
function convertBodiesToContent(
  bodies: (string | undefined)[],
): { [media: string]: OpenAPIV3.MediaTypeObject } | undefined {
  const parsed = parseJSONBodies(bodies);
  if (!parsed.length) return undefined;
  return { "application/json": { schema: convertValuesToSchema(parsed) } };
}

function convertRequestSamplesToOperation(
  samples: RequestSample[],
): OpenAPIV3.OperationObject {
  const operation: OpenAPIV3.OperationObject = { responses: {} };
  const requestContent = convertBodiesToContent(
    samples.map((s) => s.request.body),
  );
  if (requestContent) {
    operation.requestBody = { content: requestContent };
  }
  const samplesByStatus = groupBy(samples, (s) => String(s.response.status));
  for (const status in samplesByStatus) {
    operation.responses![status] = {
      description: "",
      content: convertBodiesToContent(
        samplesByStatus[status].map((s) => s.response.body),
      ),
    };
  }
  return operation;
}

export function convertAPISampleToOpenAPISpecification(
  samples: APISample,
  serverURL: string,
): OpenAPIV3.Document {
  const paths: OpenAPIV3.PathsObject = {};
  for (const pathname in samples) {
    const pathItem: OpenAPIV3.PathItemObject = {};
    const samplesByMethod = groupBy(samples[pathname], (s) =>
      s.request.method.toLowerCase(),
    );
    for (const method in samplesByMethod) {
      pathItem[method as OpenAPIV3.HttpMethods] =
        convertRequestSamplesToOperation(samplesByMethod[method]);
    }
    paths[pathname] = pathItem;
  }
  return {
    openapi: "3.0.1",
    info: { title: new URL(serverURL).host, version: "1.0.0" },
    servers: [{ url: serverURL }],
    paths,
  };
}
