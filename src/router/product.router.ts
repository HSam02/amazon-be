import { Router } from "express";
import { productEndpoints } from "../utils/endpoints";
import { joiValidation } from "../utils/joiValidation";
import { productCreateSchema } from "../validations/product.validations";
import { ProductController } from "../controllers";

const ProductRouter = Router();

ProductRouter.post(
  productEndpoints.CREATE,
  joiValidation(productCreateSchema),
  ProductController.create
);

export default ProductRouter;
