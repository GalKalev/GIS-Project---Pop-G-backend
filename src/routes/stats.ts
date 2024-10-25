import express, { Request, Response } from "express";
import { getTopCompareCountries, getTopBasicCountries } from "../services/data-source";
const router = express.Router();


/**
 * Get the top basic favored country
 */
router.get("/topCountry", async (req: Request, res: Response) => {
    try {
        const top = await getTopBasicCountries();
        if(top){
            return res.status(200).send( top);
        }else{
            return res.status(404).send('No no top basic country found');
        }

       
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
});

/**
 * Get the top compared favored countries
 */
router.get("/topCompareCountries", async (req: Request, res: Response) => {
    try {
        const top = await getTopCompareCountries();

        if(top){
            return res.status(200).send( top);
        }else{
            return res.status(404).send('No top compare countries found');
        }

        
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
});

export default router;
