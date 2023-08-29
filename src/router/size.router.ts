import { Router } from "express";
import { SizeController } from "../controllers";
import checkAdmin from "../middlewares/checkAdmin";
import joiValidation  from "../middlewares/joiValidation";
import { sizeSchema } from "../validations/size.validation";
import { sizeEndpoints } from "../utils/endpoints";

const SizeRouter = Router();

SizeRouter.post(
  sizeEndpoints.CREATE,
  checkAdmin,
  joiValidation(sizeSchema),
  SizeController.create
);
SizeRouter.patch(
  sizeEndpoints.UPDATE,
  checkAdmin,
  joiValidation(sizeSchema),
  SizeController.update
);
SizeRouter.delete(sizeEndpoints.REMOVE, checkAdmin, SizeController.remove);
SizeRouter.get(sizeEndpoints.GET_ALL, SizeController.getAll);

export default SizeRouter;
