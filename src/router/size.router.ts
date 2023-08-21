import { Router } from "express";
import { SizeController } from "../controllers";
import checkAdmin from "../utils/checkAdmin";
import { joiValidation } from "../utils/joiValidation";
import { sizeSchema } from "../validations/size.validation";

const SizeRouter = Router();

SizeRouter.get("/size", SizeController.getAll);
SizeRouter.post(
  "/size",
  checkAdmin,
  joiValidation(sizeSchema),
  SizeController.create
);
SizeRouter.patch(
  "/size/:id",
  checkAdmin,
  joiValidation(sizeSchema),
  SizeController.update
);
SizeRouter.delete("/size/:id", checkAdmin, SizeController.remove);

export default SizeRouter;
