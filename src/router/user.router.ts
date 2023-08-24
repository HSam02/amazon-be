import { Router } from "express";
import { joiValidation } from "../utils/joiValidation";
import { UserController } from "../controllers";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
} from "../validations/user.validation";
import { authEndpoints } from "../utils/endpoints";

const UserRouter = Router();

UserRouter.post(
  authEndpoints.REGISTER,
  joiValidation(registerSchema),
  UserController.register
);
UserRouter.post(
  authEndpoints.LOGIN,
  joiValidation(loginSchema),
  UserController.login
);
UserRouter.get(authEndpoints.GET_ME, UserController.getMe);
UserRouter.get(authEndpoints.CHECK_EMAIL, UserController.checkEmail);
UserRouter.get(authEndpoints.VERIFY, UserController.verify);
UserRouter.post(
  authEndpoints.CHANGE_PASSWORD,
  joiValidation(changePasswordSchema),
  UserController.changePassword
);
UserRouter.get(
  authEndpoints.SET_DEFAULT_ADDRESS,
  UserController.setDefaultAddress
);

export default UserRouter;
