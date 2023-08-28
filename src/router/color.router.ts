import { Router } from "express";
import { ColorController } from "../controllers";
import checkAdmin from "../middlewares/checkAdmin";
import { joiValidation } from "../middlewares/joiValidation";
import { colorSchema } from "../validations/color.validation";
import { colorEndpoints } from "../utils/endpoints";

const ColorRouter = Router();

ColorRouter.post(
  colorEndpoints.CREATE,
  checkAdmin,
  joiValidation(colorSchema),
  ColorController.create
);
ColorRouter.patch(
  colorEndpoints.UPDATE,
  checkAdmin,
  joiValidation(colorSchema),
  ColorController.update
);
ColorRouter.delete(colorEndpoints.REMOVE, checkAdmin, ColorController.remove);
ColorRouter.get(colorEndpoints.GET_ALL, ColorController.getAll);

export default ColorRouter;
