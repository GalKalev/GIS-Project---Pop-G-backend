import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import { findUserByEmail } from "../services/data-source";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);

  if (!user) {
    console.log("Invalid Email");
    return res.status(404).send("Invalid Email or password.");
  }

  const validPassword = await bcrypt.compare(password, user.email);
  if (!validPassword) {
    console.log("invalid password");
    return res.status(401).send("Invalid Email or password.");
  }

  return res.status(200).send("Login successful!");

});

export default router;
