import express, { Request, Response } from "express";
import { getTopCountries } from "../services/data-source";
const router = express.Router();


/**
 * Get the top basic favored country
 */
router.get("/topCountries", async (req: Request, res: Response) => {
    try {
        const top = await getTopCountries();

        return res.status(200).send( top);
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
});

export default router;
