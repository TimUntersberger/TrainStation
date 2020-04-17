import express from "express";
import { Route } from "./fileToRoute";

let router: express.Router;

function handler(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (router) router(req, res, next);
}

export function register(app: express.Application) {
  app.use(handler);
}

const schemaValidator = (route: Route) => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //TODO: validate

  next();
};

export function buildRouter(routes: Route[]) {
  /* routes indexed by their respective level in the folder structure */
  const routesByLevel: Record<number, Route[]> = {};

  routes.forEach((r) => {
    if (!routesByLevel[r.level]) routesByLevel[r.level] = [];
    routesByLevel[r.level].push(r);
  });

  router = express.Router();

  Object.keys(routesByLevel)
    .sort()
    .forEach((key, i) => {
      routesByLevel[key].forEach((r) => {
        router[r.method](
          "/" + r.url,
          ...[schemaValidator(r), ...r.middlewares],
          r.handler
        );
      });
    });

  return router;
}
