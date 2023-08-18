import express from "express";
import cors from "cors";
import checkAuth from "./utils/checkAuth.js";
import sequelize from "./config/sequelize.js";
import dotenv from "dotenv";
import { ColorController, SizeController, UserController } from "./controllers/index.js";
import { joiValidation } from "./utils/joiValidation.js";
import { loginSchema, registerSchema } from "./validation_schemas/user.validation.js";
import checkAdmin from "./utils/checkAdmin.js";
import { colorSchema } from "./validation_schemas/color.validation.js";
import { sizeSchema } from "./validation_schemas/size.validation.js";

dotenv.config();
try {
  await sequelize.authenticate();
  await sequelize.sync();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const PORT = Number(process.env.PORT);

const app = express();
app.use(cors());
app.use(express.json());
app.use(checkAuth);

app.post("/auth/register", joiValidation(registerSchema), UserController.register);
app.post("/auth/login", joiValidation(loginSchema), UserController.login);
app.get("/auth/me", UserController.getMe);
app.get("/auth/check/:email", UserController.checkEmail);
app.get("/auth/verify/:email", UserController.verify);

app.get("/color", ColorController.getAll);
app.post("/color", checkAuth, checkAdmin, joiValidation(colorSchema), ColorController.create);
app.patch("/color/:id", checkAuth, checkAdmin, joiValidation(colorSchema), ColorController.update);

app.get("/size", SizeController.getAll);
app.post("/size", checkAuth, checkAdmin, joiValidation(sizeSchema), SizeController.create);
app.patch("/size/:id", checkAuth, checkAdmin, joiValidation(sizeSchema), SizeController.update);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
