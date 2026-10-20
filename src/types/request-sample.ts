import type { Cookie, Header, QueryString } from "har-format";

export interface RequestSample {
  id: string;
  request: {
    method: string;
    url: string;
    body: string | undefined;
    cookies: Cookie[];
    headers: Header[];
    queryString: QueryString[];
    href: string;
    search: string;
    pathname: string;
  };
  response: {
    status: number;
    body: string;
    headers: Header[];
  };
}
