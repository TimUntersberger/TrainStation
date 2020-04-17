import express from "express";
import { register } from "./buildRouter";
import { generateRoutes, printRoutes } from "./generateRoutes";
import { enableHotReload, setOnHotReloadListener } from "./hotReloadTask";

export interface Request<TQuerySchema = any, TBodySchema = any>
  extends express.Request {
  query: any;
  body: any;
}
export type Response = express.Response;

export default {
  register,
  generateRoutes,
  printRoutes,
  enableHotReload,
  setOnHotReloadListener,
};
