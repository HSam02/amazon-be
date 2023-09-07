import { Router } from "express";
import { paymentEndpoints } from "../utils/endpoints";
import checkAuth from "../middlewares/checkAuth";
import joiValidation from "../middlewares/joiValidation";
import { createPaymentIntentSchema } from "../validations/payment.validations";
import { PaymentController } from "../controllers";

const PaymentRouter = Router();

PaymentRouter.post(
  paymentEndpoints.CREATE,
  checkAuth,
  joiValidation(createPaymentIntentSchema),
  PaymentController.create
);
PaymentRouter.post(paymentEndpoints.WEBHOOK, PaymentController.webhook);

export default PaymentRouter;
