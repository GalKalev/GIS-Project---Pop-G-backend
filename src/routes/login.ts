import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import { findUserByEmail, getBasicFavorites, getCompareFavorites } from "../services/data-source";

const router = express.Router();

// User login
router.post("/", async (req: Request, res: Response) => {

    const {email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
        console.log("Invalid Email");
        return res.status(404).send("Invalid Email or password.");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        console.log("invalid password");
        return res.status(401).send("Invalid Email or password.");
    }

     const basicFavorites = await getBasicFavorites(user.id);
     const compareFavorites = await getCompareFavorites(user.id);

    return res.status(200).send({message:"Login successful!", user, basicFavorites, compareFavorites});

});

export default router;
