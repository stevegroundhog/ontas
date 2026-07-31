import type { ReactNode } from "react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import appCss from "@/styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "ONTAS — Learn Nuclear Threats, DEFCON & Global Conflicts",
      },
      {
        name: "description",
        content:
          "Beginner-friendly open-source nuclear threat awareness: DEFCON explained, world conflicts, live public reports, naval estimates, and city survival kits. Educational only — not an official warning system.",
      },
      { name: "theme-color", content: "#0b1220" },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "ONTAS — Nuclear Threat Awareness & Beginner Guide" },
      {
        property: "og:description",
        content:
          "Plain-language guide to geopolitics, nuclear forces, and DEFCON — plus live open conflict reports and maps.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: RootComponent,
  errorComponent: RootError,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootError({ error }: { error: Error }) {
  return (
    <RootDocument>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#0b1220] px-6 text-center text-slate-200">
        <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
        <p className="max-w-md text-sm text-slate-400">
          {error?.message || "Unexpected application error"}
        </p>
        <button
          type="button"
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
          onClick={() => window.location.assign("/")}
        >
          Reload app
        </button>
      </div>
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
