import chokidar from "chokidar";
import path from "path";
import { buildRouter } from "./buildRouter";
import { fileToRoute } from "./fileToRoute";

let hotReload = false;
let onHotReload = () => {};
let watcher: chokidar.FSWatcher;

export function enableHotReload() {
  hotReload = true;
}

export function isHotReloadEnabled() {
  return hotReload;
}

export function setOnHotReloadListener(cb: () => void) {
  onHotReload = cb;
}

export function hotReloadTask(pattern: string, cwd: string, routes: any[]) {
  watcher = chokidar.watch(pattern, {
    cwd,
    ignoreInitial: true,
  });

  watcher
    .on("add", (x) => {
      const route = fileToRoute(x, path.join(cwd, x));
      if (route.handler) {
        routes.push(route);
        buildRouter(routes);
        onHotReload();
      }
    })
    .on("change", (x) => {
      const idx = routes.indexOf(routes.find((r) => r.filePath === x));
      const route = fileToRoute(x, path.join(cwd, x));
      if (route.handler) {
        routes[idx] = route;
        buildRouter(routes);
        onHotReload();
      }
      buildRouter(routes);
      onHotReload();
    })
    .on("unlink", (x) => {
      const idx = routes.indexOf(routes.find((r) => r.filePath === x));
      routes.splice(idx, 1);
      buildRouter(routes);
      onHotReload();
    });
}
