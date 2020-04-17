import express from "express";
import path from "path";
import trainStation from "./trainstation";

const app = express();

trainStation.enableHotReload();
trainStation.generateRoutes(path.join(__dirname, "routes"));
trainStation.printRoutes();
trainStation.register(app);
trainStation.setOnHotReloadListener(trainStation.printRoutes);

export default app;
