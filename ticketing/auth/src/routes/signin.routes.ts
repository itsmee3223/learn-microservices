import { Router } from "express";

const router = Router();

router.post("/signin", (req, res) => {
  return res.status(201).json({
    message: "Hi there!",
  });
});

export { router as signinRouter };
