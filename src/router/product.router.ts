import { Router } from "express";
import { productEndpoints } from "../utils/endpoints";
import { joiValidation } from "../middlewares/joiValidation";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../validations/product.validations";
import { ProductController } from "../controllers";
import upload from "../middlewares/multer";

const ProductRouter = Router();

ProductRouter.post(
  productEndpoints.CREATE,
  upload,
  joiValidation(productCreateSchema),
  ProductController.create
);
ProductRouter.patch(
  productEndpoints.UPDATE,
  upload,
  joiValidation(productUpdateSchema),
  ProductController.update
);
ProductRouter.delete(productEndpoints.REMOVE, ProductController.remove);
ProductRouter.get(productEndpoints.GET_MY, ProductController.getUserProducts);

export default ProductRouter;
