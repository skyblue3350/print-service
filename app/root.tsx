import type { MetaFunction } from "@remix-run/node";
import { MantineProvider } from '@mantine/core';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

import '@mantine/core/styles.css';

export const meta: MetaFunction = () => [{ title: "Internal Print Service" }];

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider>
          <Outlet />
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
