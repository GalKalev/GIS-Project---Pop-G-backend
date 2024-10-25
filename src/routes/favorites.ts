import express, { Request, Response } from "express";
import { AppDataSource } from "../services/data-source";
import { BasicFavorites } from "../entities/basicFavorites";
import { CompareFavorites } from "../entities/compareFavorites";

const router = express.Router();

/**
 * Add new basic favorite 
 */
router.post("/basic", async (req: Request, res: Response) => {
    try {
        const { country, minYear, maxYear, id } = req.body;

        // Check if the basic favorite already exists
        const existingEntry = await AppDataSource.createQueryBuilder(BasicFavorites, "basicFavorites")
            .innerJoin("basicFavorites.user", "user")  // Join the 'user' entity
            .where("user.id = :id", { id })  // Match the id of the user
            .andWhere("basicFavorites.country = :country", { country })
            .andWhere("basicFavorites.minYear = :minYear", { minYear })
            .andWhere("basicFavorites.maxYear = :maxYear", { maxYear })
            .getOne();

        if (existingEntry) {
            return res.status(400).send("The specified basic favorite already exists.");
        }

        // Create a new BasicFavorites entry
        const newBasicFavorite = new BasicFavorites();
        newBasicFavorite.country = country;
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
        const { country, minYear, maxYear, id } = req.query;

        // Find the matching BasicFavorites entry using a select query
        const basicFavorite = await AppDataSource.createQueryBuilder(BasicFavorites, "basicFavorites")
            .innerJoinAndSelect("basicFavorites.user", "user")  // Join with the 'User' entity
            .where("user.id = :id", { id })  // Match the id of the user
            .andWhere("basicFavorites.country = :country", { country })
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

/**
 * Add new compare favorite 
 */
router.post("/compare", async (req: Request, res: Response) => {
    try {
        const { country1,country2, minYear, maxYear, id } = req.body;

        // Check if the basic favorite already exists
        const existingEntry = await AppDataSource.createQueryBuilder(CompareFavorites, "compareFavorites")
            .innerJoin("compareFavorites.user", "user")  // Join the 'user' entity
            .where("user.id = :id", { id })  // Match the id of the user
            .andWhere("compareFavorites.country1 = :country1", { country1 })
            .andWhere("compareFavorites.country2 = :country2", { country2 })
            .andWhere("compareFavorites.minYear = :minYear", { minYear })
            .andWhere("compareFavorites.maxYear = :maxYear", { maxYear })
            .getOne();

        if (existingEntry) {
            return res.status(400).send("The specified compare favorite already exists.");
        }

        // Create a new CompareFavorites entry
        const newCompareFavorite = new CompareFavorites();
        newCompareFavorite.country1 = country1;
        newCompareFavorite.country2 = country2;
        newCompareFavorite.minYear = minYear;
        newCompareFavorite.maxYear = maxYear;
        newCompareFavorite.user = id; // Establish relation

        // Save the new compare favorite
        await AppDataSource.manager.save(newCompareFavorite);

        return res.status(200).send("Compare favorite added to the database.");
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error);
    }
});


/**
 * Delete a compare favorite
 */
router.delete("/compare", async (req: Request, res: Response) => {
    try {
        const { country1,country2, minYear, maxYear, id } = req.query;

        // Find the matching CompareFavorites entry using a select query
        const compareFavorite = await AppDataSource.createQueryBuilder(CompareFavorites, "compareFavorites")
            .innerJoin("compareFavorites.user", "user")  // Join the 'user' entity
            .where("user.id = :id", { id })  // Match the id of the user
            .andWhere("compareFavorites.country1 = :country1", { country1 })
            .andWhere("compareFavorites.country2 = :country2", { country2 })
            .andWhere("compareFavorites.minYear = :minYear", { minYear })
            .andWhere("compareFavorites.maxYear = :maxYear", { maxYear })
            .getOne();

            console.log(compareFavorite);

        if (!compareFavorite) {
            return res.status(404).send("Compare favorite not found.");
        }

        // Delete the found entry
        await AppDataSource.manager.remove(compareFavorite);

        return res.status(200).send("Basic favorite deleted from the database.");
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error);
    }
});

export default router;