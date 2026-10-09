import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url } = context;
  const pathname = url.pathname;

  if (context.locals.locale) {
    return next();
  }

  const localePrefix = pathname.match(/^\/(en|id)(?:\/|$)/)?.[1];

  if (localePrefix) {
    context.locals.locale = localePrefix;
    context.locals.originalUrl = url.href;
    let basePath = pathname.replace(/^\/(?:en|id)/, "");
    if (!basePath.startsWith("/")) basePath = "/" + basePath;
    return context.rewrite(new URL(`${basePath}${url.search}`, url.origin));
  }

  context.locals.locale = "en";
  context.locals.originalUrl = url.href;
  return next();
});
