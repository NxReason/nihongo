import "dotenv/config";

import path from "path";
import express from "express";
import router from "./routes/index.js";

const { PORT } = process.env;
const app = express();

app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

app.use(router);

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
