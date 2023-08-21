import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

const routerFiles = fs.readdirSync(__dirname);

routerFiles.forEach((file) => {
  if (file.endsWith(".router.js")) {
    const routerModule = require(path.join(__dirname, file));
    if (routerModule.default && typeof routerModule.default === "function") {
      router.use(routerModule.default);
    }
  }
});

export default router;
