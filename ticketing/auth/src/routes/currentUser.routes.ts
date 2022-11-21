import { Router } from "express";
import { currentUser } from "../middlewares/currentUser";

const router = Router();

router.get("/currentuser", currentUser, (req, res) => {
  return res.send({
    currentUser: req.currentUser || null,
  });
});

export { router as currentUserRouter };
