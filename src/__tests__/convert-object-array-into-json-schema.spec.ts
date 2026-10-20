import { describe, expect, it } from "vitest";
import { convertObjectArrayIntoJSONSchema } from "../convert-object-array-to-json-schema";

describe("convertObjectArrayIntoJSONSchema", function () {
  it("should convert a simple array", function () {
    const simpleArray = [
      {
        foo: "lalala",
      },
      {
        foo: "hello",
        baz: 32,
      },
    ];
    expect(convertObjectArrayIntoJSONSchema(simpleArray)).toStrictEqual({
      items: {
        properties: { baz: { type: "number" }, foo: { type: "string" } },
        required: ["foo"],
        type: "object",
      },
      title: "",
      type: "array",
    });
  });
});
