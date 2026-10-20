declare module "generate-schema" {
  import type { IJsonSchema } from "openapi-types";
  export function json(title: string, objects: any[]): IJsonSchema;
}
