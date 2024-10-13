import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user";
import { AppDataSource } from "../services/data-source";
import { IUser } from "../types";
import { validate } from "../services/validation";

const router = express.Router();

// User registration
router.post("/", async (req: Request, res: Response) => {
  try {
    const { password, firstName, lastName, phone, email, isAdmin, originCountry } = req.body;

    // Validate user input
    const validationResult = await validate({
      firstName,
      lastName,
      phone,
      email,
      password,
      isAdmin,
      originCountry,
      basicFavorites: [],  // Add empty array
      compareFavorites: [] 
    });

    if (!validationResult.valid) {
      return res.status(400).json({ errors: validationResult.errors });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user object with empty favorite arrays
    const user: IUser = {
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      isAdmin,
      originCountry,
      basicFavorites: [],  // Start with an empty array
      compareFavorites: [],  // Start with an empty array
    };

    // Insert the new user into the database
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values(user)
      .execute();

    return res.status(200).send("User added to the database with empty favorite entries.");
  } catch (err) {
    console.error(err.message);
    return res.status(500).send(err.message);
  }
});

export default router;
