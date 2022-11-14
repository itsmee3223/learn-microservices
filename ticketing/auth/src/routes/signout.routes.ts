import { Router } from "express";

const router = Router();

router.post("/signout", (req, res) => {
  return res.status(200).json({
    message: "hi there",
  });
});

export { router as signoutRouter };
