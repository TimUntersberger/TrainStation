import glob from "glob";
import { buildRouter } from "./buildRouter";
import { fileToRoute, Route } from "./fileToRoute";
import { hotReloadTask, isHotReloadEnabled } from "./hotReloadTask";

let routes: Route[] = [];

export function getRoutes() {
  return routes;
}

export function printRoutes() {
  routes.map((r) => `${r.method} ${r.url}`).forEach((x) => console.log(x));
}

export function generateRoutes(cwd) {
  const pattern = "**/*.ts";

  routes = glob
    .sync(pattern, { cwd })
    .map((x) => fileToRoute(x, `${cwd}/${x}`))
    .filter((x) => x.handler);

  buildRouter(routes);

  if (isHotReloadEnabled()) {
    hotReloadTask(pattern, cwd, routes);
  }
}
