// @ts-ignore
import * as GenerateSchema from "generate-schema";
export function convertObjectArrayIntoJSONSchema(array: any[]): object {
  const jsonSchema = GenerateSchema.json("", array);
  delete jsonSchema.$schema;
  return JSON.parse(JSON.stringify(jsonSchema).replace(/null/g, "string"));
}
