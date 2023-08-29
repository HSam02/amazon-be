import express from "express";
import cors from "cors";
require("dotenv").config();
import db from "./database/models";
import setUser from "./middlewares/setUser";
import router from "./router";

const port = Number(process.env.PORT);
const app = express();

app.use(cors());
app.use(express.json());
app.use(setUser);
app.use(router);
app.use("/uploads", express.static("./src/uploads"));

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((err: any) => console.log(err));
