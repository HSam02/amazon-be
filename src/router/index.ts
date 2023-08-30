import { Router } from "express";
import fs from "fs";

const router = Router();

const routerFiles = fs.readdirSync(__dirname);

routerFiles.forEach((file) => {
  if (file.endsWith(".router.ts")) {
    const routerModule = require(`./${file.replace(".ts", "")}`);

    if (routerModule.default && typeof routerModule.default === "function") {
      router.use(routerModule.default);
    }
  }
});

export default router;
