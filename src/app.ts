import express from "express";
import cors from "cors";
require("dotenv").config();
import db from "./database/models";
import checkAuth from "./utils/checkAuth";
import { joiValidation } from "./utils/joiValidation";
import * as Validations from "./utils/validation_schemas";
import { ColorController, SizeController, UserController } from "./controllers";
import checkAdmin from "./utils/checkAdmin";

const port = Number(process.env.PORT);
const app = express();
app.use(cors());
app.use(express.json());
app.use(checkAuth);

app.post(
  "/auth/register",
  joiValidation(Validations.registerSchema),
  UserController.register
);
app.post(
  "/auth/login",
  joiValidation(Validations.loginSchema),
  UserController.login
);
app.get("/auth/me", UserController.getMe);
app.get("/auth/check/:email", UserController.checkEmail);
app.get("/auth/verify/:email", UserController.verify);

app.get("/color", ColorController.getAll);
app.post(
  "/color",
  checkAuth,
  checkAdmin,
  joiValidation(Validations.colorSchema),
  ColorController.create
);
app.patch(
  "/color/:id",
  checkAuth,
  checkAdmin,
  joiValidation(Validations.colorSchema),
  ColorController.update
);
app.delete("/color/:id", checkAuth, checkAdmin, ColorController.remove);

app.get("/size", SizeController.getAll);
app.post(
  "/size",
  checkAuth,
  checkAdmin,
  joiValidation(Validations.sizeSchema),
  SizeController.create
);
app.patch(
  "/size/:id",
  checkAuth,
  checkAdmin,
  joiValidation(Validations.sizeSchema),
  SizeController.update
);
app.delete("/size/:id", checkAuth, checkAdmin, SizeController.remove);

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((err: any) => console.log(err));
