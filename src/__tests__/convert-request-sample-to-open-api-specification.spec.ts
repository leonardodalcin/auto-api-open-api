import { describe, expect, it } from "vitest";
import { convertAPISampleToOpenAPISpecification } from "../convert-request-sample-to-open-api-specification";
import type { RequestSample } from "../types/request-sample";

function sample(
  method: string,
  pathname: string,
  status: number,
  requestBody: string | undefined,
  responseBody: string,
): RequestSample {
  const url = `https://api.example.com${pathname}`;
  return {
    id: `${method} ${pathname} ${status}`,
    request: {
      method,
      url,
      body: requestBody,
      cookies: [],
      headers: [],
      queryString: [],
      href: url,
      search: "",
      pathname,
    },
    response: { status, body: responseBody, headers: [] },
  };
}

describe("convertAPISampleToOpenAPISpecification", function () {
  it("should keep every method of a path and group responses by status", function () {
    const specification = convertAPISampleToOpenAPISpecification(
      {
        "/users": [
          sample("GET", "/users", 200, undefined, '[{"id":1}]'),
          sample("POST", "/users", 201, '{"name":"foo"}', '{"id":2}'),
          sample("POST", "/users", 400, '{"name":3}', "not json"),
        ],
      },
      "https://api.example.com",
    );

    expect(specification.info.title).toBe("api.example.com");
    expect(specification.servers).toStrictEqual([
      { url: "https://api.example.com" },
    ]);
    const users = specification.paths["/users"]!;
    expect(users.get!.requestBody).toBeUndefined();
    expect(users.get!.responses!["200"]).toStrictEqual({
      description: "",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: { id: { type: "number" } },
            },
          },
        },
      },
    });
    expect(users.post!.requestBody).toStrictEqual({
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: { name: { type: ["string", "number"] } },
            required: ["name"],
          },
        },
      },
    });
    expect(Object.keys(users.post!.responses!)).toStrictEqual(["201", "400"]);
    expect(users.post!.responses!["400"]).toStrictEqual({
      description: "",
      content: undefined,
    });
  });

  it("should handle empty array bodies", function () {
    const specification = convertAPISampleToOpenAPISpecification(
      { "/users": [sample("GET", "/users", 200, undefined, "[]")] },
      "https://api.example.com",
    );

    expect(specification.paths["/users"]!.get!.responses!["200"]).toStrictEqual(
      {
        description: "",
        content: {
          "application/json": { schema: { type: "array", items: {} } },
        },
      },
    );
  });
});
