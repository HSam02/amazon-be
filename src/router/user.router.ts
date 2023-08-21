import { Router } from "express";
import { joiValidation } from "../utils/joiValidation";
import { UserController } from "../controllers";
import {
  loginSchema,
  registerSchema,
} from "../utils/validation_schemas/user.validation";

const UserRouter = Router();

UserRouter.post(
  "/auth/register",
  joiValidation(registerSchema),
  UserController.register
);
UserRouter.post(
  "/auth/login",
  joiValidation(loginSchema),
  UserController.login
);
UserRouter.get("/auth/me", UserController.getMe);
UserRouter.get("/auth/check/:email", UserController.checkEmail);
UserRouter.get("/auth/verify/:email", UserController.verify);

export default UserRouter;
