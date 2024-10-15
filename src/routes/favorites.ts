import express, { Request, Response } from "express";
import { AppDataSource } from "../services/data-source";
import { BasicFavorites } from "../entities/basicFavorites";

const router = express.Router();

/**
 * Add new basic favorite 
 */
router.post("/basic", async (req: Request, res: Response) => {
    try {
        const { countryWBId, minYear, maxYear, id } = req.body;

        // Check if the basic favorite already exists
        const existingEntry = await AppDataSource.createQueryBuilder(BasicFavorites, "basicFavorites")
            .innerJoin("basicFavorites.user", "user")  // Join the 'user' entity
            .where("user.id = :id", { id })  // Match the id of the user
            .andWhere("basicFavorites.countryWBId = :countryWBId", { countryWBId })
            .andWhere("basicFavorites.minYear = :minYear", { minYear })
            .andWhere("basicFavorites.maxYear = :maxYear", { maxYear })
            .getOne();

        if (existingEntry) {
            return res.status(400).send("The specified basic favorite already exists.");
        }

        // Create a new BasicFavorites entry
        const newBasicFavorite = new BasicFavorites();
        newBasicFavorite.countryWBId = countryWBId;
        newBasicFavorite.minYear = minYear;
        newBasicFavorite.maxYear = maxYear;
        newBasicFavorite.user = id; // Establish relation

        // Save the new basic favorite
        await AppDataSource.manager.save(newBasicFavorite);

        return res.status(200).send("Basic favorite added to the database.");
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error);
    }
});


/**
 * Delete a basic favorite
 */
router.delete("/basic", async (req: Request, res: Response) => {
    try {
        const { countryWBId, minYear, maxYear, id } = req.query;

        // Find the matching BasicFavorites entry using a select query
        const basicFavorite = await AppDataSource.createQueryBuilder(BasicFavorites, "basicFavorites")
            .innerJoinAndSelect("basicFavorites.user", "user")  // Join with the 'User' entity
            .where("user.id = :id", { id })  // Match the id of the user
            .andWhere("basicFavorites.countryWBId = :countryWBId", { countryWBId })
            .andWhere("basicFavorites.minYear = :minYear", { minYear })
            .andWhere("basicFavorites.maxYear = :maxYear", { maxYear })
            .getOne();

            console.log(basicFavorite);

        if (!basicFavorite) {
            return res.status(404).send("Basic favorite not found.");
        }

        // Delete the found entry
        await AppDataSource.manager.remove(basicFavorite);

        return res.status(200).send("Basic favorite deleted from the database.");
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error);
    }
});

export default router;