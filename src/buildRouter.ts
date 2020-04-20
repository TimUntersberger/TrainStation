import express from "express";
import { isRight } from "fp-ts/lib/Either";
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
  const queryErrors = [];
  const bodyErrors = [];

  if (route.querySchema) {
    const result = route.querySchema.decode(req.query);

    if (!isRight(result)) {
      result.left
        .map((x) => {
          return {
            field: x.context[1].key,
            message: x.message,
          };
        })
        .forEach((x) => queryErrors.push(x));
    }
  }

  if (route.bodySchema) {
    const result = route.bodySchema.decode(req.body);

    if (!isRight(result)) {
      result.left
        .map((x) => {
          return {
            field: x.context[1].key,
            message: x.message,
          };
        })
        .forEach((x) => bodyErrors.push(x));
    }
  }

  if (queryErrors.length != 0 || bodyErrors.length != 0) {
    res
      .status(400)
      .json({
        query: queryErrors,
        body: bodyErrors,
      })
      .end();
  } else {
    next();
  }
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
