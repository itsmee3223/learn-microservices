import express from "express";
import "express-async-errors";
import { NotFoundError } from "./errors/notFoundError";
import { errorHandler } from "./middlewares/errorHandler";
import { currentUFserRouter } from "./routes/currentUser.routes";
import { signinRouter } from "./routes/signin.routes";
import { signoutRouter } from "./routes/signout.routes";
import { signupRouter } from "./routes/signup.routes";

const app = express();
app.use(express.json());

app.use("/api/v1/users", currentUFserRouter);
app.use("/api/v1/users", signinRouter);
app.use("/api/v1/users", signoutRouter);
app.use("/api/v1/users", signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000!!!!!!!!");
});
