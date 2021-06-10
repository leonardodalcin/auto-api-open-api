chrome.devtools.panels.create(
    "My Panel",
    "icon.png",
    "devtools.html",
    function (panel) {}
);

import { Cookie, Header, QueryString } from "har-format";


interface RequestSample {
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
let isFirst = true;
let filterURLRegex = "github.com";
let items: { [pathname: string]: RequestSample[] } = {};
const requestSamplerListener = (req: chrome.devtools.network.Request) => {
  req.getContent((content) => {
    const { request, response } = req;
    if (request.url) {
      const url = new URL(request.url);

      // only save requests that passes the given URL regex
      if (!url.pathname.includes(filterURLRegex)) return;
      const requestSample: RequestSample = {
        id: req._request_id as string,
        request: {
          method: request.method,
          url: request.url,
          body: request.postData?.text,
          cookies: request.cookies,
          headers: request.headers,
          queryString: request.queryString,
          href: url.href,
          search: url.search,
          pathname: url.pathname,
        },
        response: {
          status: response.status,
          body: content,
          headers: response.headers,
        },
      };
      if (isFirst) {
        chrome.storage.sync.clear();
        isFirst = false;
      } else {
        if (!items[requestSample.request.pathname]) {
          items[requestSample.request.pathname] = [];
        }
        items[requestSample.request.pathname].push(requestSample);
      }
    }
  });
};
chrome.devtools.network.onRequestFinished.addListener(requestSamplerListener);

function saveDBAsJSON() {
  chrome.storage.sync.get((items) => {
    console.log(JSON.stringify(items));
  });
}
document
  .getElementById("save-db-as-json")!
  .addEventListener("click", saveDBAsJSON);
function startSampling() {}
function stopSampling() {
  chrome.storage.sync.clear();

  chrome.devtools.network.onRequestFinished.removeListener(
    requestSamplerListener
  );
}
