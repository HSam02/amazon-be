import { Router } from "express";
import { AddressController } from "../controllers";
import joiValidation from "../middlewares/joiValidation";
import checkAuth from "../middlewares/checkAuth";
import { addressEndpoints } from "../utils/endpoints";
import { addressSchema } from "../validations/address.validations";

const AddressRouter = Router();

AddressRouter.post(
  addressEndpoints.CREATE,
  checkAuth,
  joiValidation(addressSchema),
  AddressController.create
);
AddressRouter.patch(
  addressEndpoints.UPDATE,
  checkAuth,
  joiValidation(addressSchema),
  AddressController.update
);
AddressRouter.delete(
  addressEndpoints.REMOVE,
  checkAuth,
  AddressController.remove
);
AddressRouter.get(
  addressEndpoints.GET_ALL,
  checkAuth,
  AddressController.getAll
);

export default AddressRouter;
