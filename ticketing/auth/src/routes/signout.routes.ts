import { Router } from "express";

const router = Router();

router.post("/signout", (req, res) => {
  req.session = null;

  return res.send({});
});

export { router as signoutRouter };
