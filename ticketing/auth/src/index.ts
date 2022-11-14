import express from "express";

import { NotFoundError } from "./errors/notFoundError";
import { errorHandler } from "./middlewares/errorHandler";

import { currentUFserRouter } from "./routes/currentUser.routes";
import { signinRouter } from "./routes/signin.routes";
import { signoutRouter } from "./routes/signout.routes";
import { signupRouer } from "./routes/signup.routes";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Server is running on port 3000",
  });
});

app.use("/api/v1/users", signinRouter);
app.use("/api/v1/users", signupRouer);
app.use("/api/v1/users", signoutRouter);
app.use("/api/v1/users", currentUFserRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
