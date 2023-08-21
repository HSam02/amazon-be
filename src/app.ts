import express from "express";
import cors from "cors";
require("dotenv").config();
import db from "./database/models";
import checkAuth from "./utils/checkAuth";
import router from "./router";

const port = Number(process.env.PORT);
const app = express();

app.use(cors());
app.use(express.json());
app.use(checkAuth);
app.use(router);

db.sequelize
  .sync()
  .then(() => {
    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((err: any) => console.log(err));
