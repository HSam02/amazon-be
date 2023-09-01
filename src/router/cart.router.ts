import { Router } from "express";
import { cartEndpoints } from "../utils/endpoints";
import checkAuth from "../middlewares/checkAuth";
import joiValidation from "../middlewares/joiValidation";
import { CartController } from "../controllers";
import {
  createCartSchema,
  updateCartSchema,
} from "../validations/cart.validation";

const CartRouter = Router();

CartRouter.post(
  cartEndpoints.CREATE,
  checkAuth,
  joiValidation(createCartSchema),
  CartController.create
);
CartRouter.patch(
  cartEndpoints.UPDATE,
  checkAuth,
  joiValidation(updateCartSchema),
  CartController.update
);
CartRouter.delete(cartEndpoints.REMOVE, checkAuth, CartController.remove);
CartRouter.get(cartEndpoints.GET_MY, checkAuth, CartController.getMy);

export default CartRouter;
