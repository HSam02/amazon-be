import { Router } from "express";
import { addressEndpoints } from "../utils/endpoints";
import joiValidation  from "../middlewares/joiValidation";
import { addressSchema } from "../validations/address.validations";
import { AddressController } from "../controllers";

const AddressRouter = Router();

AddressRouter.post(
  addressEndpoints.CREATE,
  joiValidation(addressSchema),
  AddressController.create
);
AddressRouter.patch(
  addressEndpoints.UPDATE,
  joiValidation(addressSchema),
  AddressController.update
);
AddressRouter.delete(addressEndpoints.REMOVE, AddressController.remove);
AddressRouter.get(addressEndpoints.GET_ALL, AddressController.getAll);

export default AddressRouter;
