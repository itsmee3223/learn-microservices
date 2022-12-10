import express from "express";
import "express-async-errors";
import cookieSeesion from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@itsme33/common";

const app = express();
app.set("trust proxy", true);
app.use(express.json());
app.use(
  cookieSeesion({
    signed: false,
    secure: process.env.NODE_ENV === "test",
  })
);

app.use(currentUser);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
