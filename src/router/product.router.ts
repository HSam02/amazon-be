import { Router } from "express";
import { ProductController } from "../controllers";
import checkAuth from "../middlewares/checkAuth";
import upload from "../middlewares/multer";
import joiValidation from "../middlewares/joiValidation";
import { productEndpoints } from "../utils/endpoints";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../validations/product.validations";

const ProductRouter = Router();

ProductRouter.post(
  productEndpoints.CREATE,
  checkAuth,
  upload,
  joiValidation(productCreateSchema),
  ProductController.create
);
ProductRouter.patch(
  productEndpoints.UPDATE,
  checkAuth,
  upload,
  joiValidation(productUpdateSchema),
  ProductController.update
);
ProductRouter.delete(
  productEndpoints.REMOVE,
  checkAuth,
  ProductController.remove
);
ProductRouter.get(
  productEndpoints.GET_MY,
  checkAuth,
  ProductController.getUserProducts
);
ProductRouter.get(productEndpoints.GET_ALL, ProductController.getAll);

export default ProductRouter;
