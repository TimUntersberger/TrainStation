import express from "express";
import * as t from "io-ts";
import { register } from "./buildRouter";
import { generateRoutes, printRoutes, getRoutes } from "./generateRoutes";
import { enableHotReload, setOnHotReloadListener } from "./hotReloadTask";

export interface Request<TQuerySchema = any, TBodySchema = any>
  extends express.Request {
  query: TQuerySchema extends t.Type<any> ? t.TypeOf<TQuerySchema> : any;
  body: TBodySchema extends t.Type<any> ? t.TypeOf<TBodySchema> : any;
}
export type Response = express.Response;

export default {
  getRoutes,
  register,
  generateRoutes,
  printRoutes,
  enableHotReload,
  setOnHotReloadListener,
};
