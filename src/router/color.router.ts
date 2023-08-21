import { Router } from "express";
import { ColorController } from "../controllers";
import checkAdmin from "../utils/checkAdmin";
import { joiValidation } from "../utils/joiValidation";
import { colorSchema } from "../validations/color.validation";

const ColorRouter = Router();

ColorRouter.get("/color", ColorController.getAll);
ColorRouter.post(
  "/color",
  checkAdmin,
  joiValidation(colorSchema),
  ColorController.create
);
ColorRouter.patch(
  "/color/:id",

  checkAdmin,
  joiValidation(colorSchema),
  ColorController.update
);
ColorRouter.delete("/color/:id", checkAdmin, ColorController.remove);

export default ColorRouter;
