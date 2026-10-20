import type { RequestSample } from "./request-sample";

export type APISample = { [pathname: string]: RequestSample[] };
