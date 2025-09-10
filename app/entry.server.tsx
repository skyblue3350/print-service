import { PassThrough } from "stream";
import type { EntryContext } from "@remix-run/node";
// import * as remixNode from "@remix-run/node";
import { RemixServer } from "@remix-run/react";

import ReactDOMServer from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const ua = request.headers.get("user-agent") || "";
  const callbackName = /bot/i.test(ua)
    ? "renderToStaticMarkup"
    : "renderToPipeableStream";

  return new Promise((resolve, reject) => {
    let didError = false;
    const { pipe, abort } = (ReactDOMServer as any)[callbackName](
      <RemixServer context={remixContext} url={request.url} />,
      {
        onAllReady() {
          const body = new PassThrough();
          responseHeaders.set("Content-Type", "text/html");
          const nodeStream = body;
          const webStream = new ReadableStream({
            start(controller) {
              nodeStream.on('data', (chunk) => controller.enqueue(chunk));
              nodeStream.on('end', () => controller.close());
              nodeStream.on('error', (err) => controller.error(err));
            }
          });
          resolve(
            new Response(webStream, {
              status: didError ? 500 : responseStatusCode,
              headers: responseHeaders,
            })
          );
          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(err: unknown) {
          didError = true;
          console.error(err);
        },
      }
    );
    setTimeout(abort, 5000);
  });
}
