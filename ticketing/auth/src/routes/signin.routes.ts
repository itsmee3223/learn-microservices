import { Request, Response, Router } from "express";
import jwt from "jsonwebtoken";

import { body } from "express-validator";
import { BadRequestError } from "../errors/badRequestError";
import { validateRequest } from "../middlewares/validateRequest";
import { User } from "../models/User.model";
import { Password } from "../services/password";

const router = Router();

router.post(
  "/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Please input your password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existUser = await User.findOne({ email });
    if (!existUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const isPassword = await Password.compare(existUser.password, password);
    if (!isPassword) {
      throw new BadRequestError("Invalid credentials");
    }

    const userJwt = jwt.sign(
      { id: existUser.id, email: existUser.email },
      process.env.JWT_KEY
    );

    req.session = {
      jwt: userJwt,
    };

    return res.status(200).send(existUser);
  }
);

export { router as signinRouter };
