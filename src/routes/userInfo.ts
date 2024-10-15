import express, { Request, Response } from "express";
import { findUserByEmail, updateUserInfo } from "../services/data-source";

const router = express.Router();

// User info from db (first name, last name, origin country and phone)
router.post("/", async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, phone, originCountry, email, id, prevEmail } = req.body;

        // Check if current user exists
        const user = await findUserByEmail(prevEmail);

        if (!user) {
            console.error("User not found");
            return res.status(404).send("User not found");
        }


        if (prevEmail !== email) {
            // Checks if new email is used by another user
            const newEmailUser = await findUserByEmail(email);

            if (newEmailUser) {
                console.error('Email already exist')
                return res.status(404).send("Email already exist");
            }
        }

        // Updates the new info to db
        const isUpdated = await updateUserInfo(email,firstName, lastName, phone, originCountry, id);
        if (isUpdated) {
            return res.status(200).send("User info updated successfully");
        } else {
            return res.status(500).send("Failed to update user info");
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
});

export default router;
