import { Router } from "express";
import { BuyLaterController } from "../controllers";
import { createBuyLaterSchema } from "../validations/buyLater.validation";
import { buyLaterEndpoints } from "../utils/endpoints";
import checkAuth from "../middlewares/checkAuth";
import joiValidation from "../middlewares/joiValidation";

const BuyLaterRouter = Router();

BuyLaterRouter.post(
  buyLaterEndpoints.CREATE,
  checkAuth,
  joiValidation(createBuyLaterSchema),
  BuyLaterController.create
);
BuyLaterRouter.delete(
  buyLaterEndpoints.REMOVE,
  checkAuth,
  BuyLaterController.remove
);
BuyLaterRouter.get(
  buyLaterEndpoints.GET_MY,
  checkAuth,
  BuyLaterController.getMy
);

export default BuyLaterRouter;
