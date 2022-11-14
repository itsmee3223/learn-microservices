import { Router } from "express";

const router = Router();

router.get("/currentuser", (req, res) => {
  return res.status(200).json({
    message: "hi there",
  });
});

export { router as currentUFserRouter };
