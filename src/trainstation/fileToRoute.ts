import express from "express";
import { Request, Response } from ".";
import { requireUncached } from "./util";

export type Route = {
  filePath: string;
  level: number;
  querySchema?: any;
  bodySchema?: any;
  middlewares: express.RequestHandler[];
  method: "get" | "post" | "delete" | "patch" | "put";
  url: string;
  handler: (request: Request, response: Response) => void;
};

export function fileToRoute(relativePath: string, path: string): Route {
  const mod = requireUncached(path);
  const level = relativePath.split("/").length;
  const middlewares = mod.middlewares ?? [];
  const method = mod.method ?? "get";
  const querySchema = mod.querySchema ?? null;
  const bodySchema = mod.bodySchema ?? null;
  const url = mod.url
    ? [...relativePath.split("/").slice(0, level - 1), mod.url].join("/")
    : relativePath.split(".")[0];
  const handler = mod.default;

  return {
    filePath: relativePath,
    level,
    querySchema,
    bodySchema,
    middlewares,
    method,
    url,
    handler,
  };
}
