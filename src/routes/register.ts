import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user";
import { AppDataSource } from "../services/data-source";
import { IUser } from "../types";
import { validate } from "../services/validation";
import { Favorites } from "../entities/favorites";

const router = express.Router();

// User registration
router.post("/", async (req: Request, res: Response) => {
  try {
    const { password, firstName, lastName, phone, userId, email, isAdmin,originCountry } =
      req.body;

    // Check if the content is valid

    console.log(req.body)
    const validationResult = await validate({
      firstName,
      lastName,
      phone,
      userId,
      email,
      password,
      isAdmin,
      originCountry,
    });

    if (!validationResult.valid) {
      return res.status(400).json({ errors: validationResult.errors });
    }

    // Bcrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user: IUser = {
      firstName,
      lastName,
      phone,
      userId,
      email,
      password: hashedPassword,
      isAdmin,
      originCountry,
    };

    // Add user to DB
    const newUser = await AppDataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();

    // Create favorites for the new user
    const favorites = new Favorites();
    favorites.user = newUser.generatedMaps[0].id; // Set the new user ID here
    favorites.basic = [];
    favorites.compare = [];

    // Add favorites to DB
    await AppDataSource
      .createQueryBuilder()
      .insert()
      .into(Favorites)
      .values(favorites)
      .execute();

    // Update user's favorites ID
    await AppDataSource
      .createQueryBuilder()
      .update(User)
      .set({ favorite: favorites })
      .where("id = :id", { id: newUser.generatedMaps[0].id })
      .execute();
  

    return res.status(200).send("user added to db");
  } catch (err) {
    return res.status(401).send(err);
  }
});

export default router;
