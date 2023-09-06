import { Router } from "express";
import { OrderController } from "../controllers";
import { orderEndpoints } from "../utils/endpoints";
import { createOrderSchema } from "../validations/order.validations";
import checkAuth from "../middlewares/checkAuth";
import joiValidation from "../middlewares/joiValidation";

const OrderRouter = Router();

OrderRouter.post(
  orderEndpoints.CREATE,
  checkAuth,
  joiValidation(createOrderSchema),
  OrderController.create
);
OrderRouter.get(orderEndpoints.GET_MY, checkAuth, OrderController.getAll);

export default OrderRouter;
