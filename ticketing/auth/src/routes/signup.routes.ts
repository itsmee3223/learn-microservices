import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/badRequestError";
import { DatabaseConnectionError } from "../errors/databaseConnectionError";
import { RequestValidationError } from "../errors/requestValidationError";
import { User } from "../models/User.model";

const router = Router();

router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError("Email in user");
    }

    const user = User.build({ email, password });
    await user.save();

    return res.status(201).json(user);
  }
);

export { router as signupRouter };
