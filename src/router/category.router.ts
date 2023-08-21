import { Router } from "express";
import checkAdmin from "../utils/checkAdmin";
import { joiValidation } from "../utils/joiValidation";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "../validations/category.validation";
import { CategoryController } from "../controllers";

const CategoryRouter = Router();

CategoryRouter.post(
  "/category",
  checkAdmin,
  joiValidation(categoryCreateSchema),
  CategoryController.create
);
CategoryRouter.patch(
  "/category/:id",
  checkAdmin,
  joiValidation(categoryUpdateSchema),
  CategoryController.update
);
CategoryRouter.delete("/category/:id", checkAdmin, CategoryController.remove);
CategoryRouter.get("/category", CategoryController.getAll);

export default CategoryRouter;
