import { Router } from "express";
import checkAdmin from "../middlewares/checkAdmin";
import joiValidation  from "../middlewares/joiValidation";
import {
  categoryCreateSchema,
  categoryUpdateSchema,
} from "../validations/category.validation";
import { CategoryController } from "../controllers";
import { categoryEndpoints } from "../utils/endpoints";

const CategoryRouter = Router();

CategoryRouter.post(
  categoryEndpoints.CREATE,
  checkAdmin,
  joiValidation(categoryCreateSchema),
  CategoryController.create
);
CategoryRouter.patch(
  categoryEndpoints.UPDATE,
  checkAdmin,
  joiValidation(categoryUpdateSchema),
  CategoryController.update
);
CategoryRouter.delete(
  categoryEndpoints.REMOVE,
  checkAdmin,
  CategoryController.remove
);
CategoryRouter.get(categoryEndpoints.GET_ALL, CategoryController.getAll);

export default CategoryRouter;
