import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  const pathname = url.pathname;

  if (context.locals.locale) {
    return next();
  }

  if (pathname.startsWith("/en/") || pathname === "/en") {
    context.locals.locale = "en";
    context.locals.originalUrl = url.href;
    let basePath = pathname.replace(/^\/en/, "");
    if (!basePath.startsWith("/")) basePath = "/" + basePath;
    if (basePath === "//") basePath = "/";
    return context.rewrite(new URL(`${basePath}${url.search}`, url.origin));
  }

  context.locals.locale = "id";
  context.locals.originalUrl = url.href;
  return next();
});
