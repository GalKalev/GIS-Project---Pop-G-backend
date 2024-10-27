import express, { Request, Response } from "express";
import { AppDataSource, getBasicFavorites, getCompareFavorites } from "../services/data-source";
import { BasicFavorites } from "../entities/basicFavorites";
import { CompareFavorites } from "../entities/compareFavorites";

const router = express.Router();

/**
 * Add new basic favorite 
 */
router.post("/basic", async (req: Request, res: Response) => {
    try {
        const { country, WBId, minYear, maxYear, id } = req.body;

        // Check if the basic favorite already exists
        const existingEntry = await AppDataSource.createQueryBuilder(BasicFavorites, "basicFavorites")
            .innerJoin("basicFavorites.user", "user")  // Join the 'user' entity
            .where("user.id = :id", { id })  // Match the id of the user
            .andWhere("basicFavorites.country = :country", { country })
            .andWhere("basicFavorites.minYear = :minYear", { minYear })
            .andWhere("basicFavorites.maxYear = :maxYear", { maxYear })
            .andWhere("basicFavorites.WBId = :WBId", { WBId })
            .getOne();

        if (existingEntry) {
            return res.status(400).send("The specified basic favorite already exists.");
        }

        // Create a new BasicFavorites entry
        const newBasicFavorite = new BasicFavorites();
        newBasicFavorite.country = country;
        newBasicFavorite.minYear = minYear;
        newBasicFavorite.maxYear = maxYear;
        newBasicFavorite.WBId = WBId;
        newBasicFavorite.user = id; // Establish relation

        // Save the new basic favorite
        await AppDataSource.manager.save(newBasicFavorite);

        const basicFavorites = await getBasicFavorites(id);

        return res.status(200).send(basicFavorites);
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
        const { id, userId } = req.query;

        const basicFavorite = await AppDataSource.createQueryBuilder(BasicFavorites, "basicFavorites")
            .innerJoinAndSelect("basicFavorites.user", "user")
            .where("basicFavorites.id = :id", { id })
            .getOne();


        if (!basicFavorite || basicFavorite?.user.id !== Number(userId)) {
            return res.status(404).send("Basic favorite not found.");
        }

        // Delete the found entry
        await AppDataSource.manager.remove(basicFavorite);

        const basicFavorites = await getBasicFavorites(Number(userId));

        return res.status(200).send(basicFavorites);
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
        const { country1, WBId1, country2, WBId2, minYear, maxYear, id } = req.body;

        // Check if the basic favorite already exists
        const existingEntry = await AppDataSource.createQueryBuilder(CompareFavorites, "compareFavorites")
            .innerJoin("compareFavorites.user", "user")  // Join the 'user' entity
            .where("user.id = :id", { id })  // Match the id of the user
            .andWhere("compareFavorites.country1 = :country1", { country1 })
            .andWhere("compareFavorites.WBId1 = :WBId1", { WBId1 })
            .andWhere("compareFavorites.country2 = :country2", { country2 })
            .andWhere("compareFavorites.WBId2 = :WBId2", { WBId2 })
            .andWhere("compareFavorites.minYear = :minYear", { minYear })
            .andWhere("compareFavorites.maxYear = :maxYear", { maxYear })
            .getOne();

        if (existingEntry) {
            return res.status(400).send("The specified compare favorite already exists.");
        }

        // Create a new CompareFavorites entry
        const newCompareFavorite = new CompareFavorites();
        newCompareFavorite.country1 = country1;
        newCompareFavorite.WBId1 = WBId1;
        newCompareFavorite.country2 = country2;
        newCompareFavorite.WBId2 = WBId2;
        newCompareFavorite.minYear = minYear;
        newCompareFavorite.maxYear = maxYear;
        newCompareFavorite.user = id; // Establish relation

        // Save the new compare favorite
        await AppDataSource.manager.save(newCompareFavorite);

        const compareFavorites = await getCompareFavorites(id);


        return res.status(200).send(compareFavorites);
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
        const { id, userId } = req.query;

        // Find the matching CompareFavorites entry using a select query
        const compareFavorite = await AppDataSource.createQueryBuilder(CompareFavorites, "compareFavorites")
            .innerJoinAndSelect("compareFavorites.user", "user")
            .where("compareFavorites.id = :id", { id })
            .getOne();

        if (!compareFavorite || compareFavorite?.user.id !== Number(userId)) {
            return res.status(404).send("Compare favorite not found.");
        }

        // Delete the found entry
        await AppDataSource.manager.remove(compareFavorite);

        const compareFavorites = await getCompareFavorites(Number(userId))

        return res.status(200).send(compareFavorites);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send(error);
    }
});

export default router;