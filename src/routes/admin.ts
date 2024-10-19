import express, { Request, Response } from "express";
import { blockCountry, getAllUsers, getBlockedCountries, removeBlockedCountry, updateAdmin } from "../services/data-source";
import checkAdmin from "../middleware/checkAdmin";

const router = express.Router();

router.get('/', checkAdmin, (req, res) => {
    console.log('check admin')
    res.json({ message: 'Welcome to the admin panel.' });
});

// Get all POP-G users' info from db (first name, last name, origin country and phone)
router.get("/users", async (req: Request, res: Response) => {
    try {
        const users = await getAllUsers();

        return res.status(200).send( users);
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
});

// Change user's admin status
router.post("/users/update", async(req: Request, res: Response) => {
    try {
        const {id, isAdmin} = req.body;
        const isAdminUpdated = await updateAdmin(id, isAdmin);

        if(isAdminUpdated){
            return  res.status(200).send('Admin status has change');
        }else{
            return  res.status(404).send('Error updating admin status');
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
}) 

// Fetches the blocked countries from db
router.get('/countries', async (req: Request, res: Response) => {
    try {
        const countries = await getBlockedCountries();

        return res.status(200).send( countries);
        
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
});

// Add new blocked country
router.post("/countries/add", async(req: Request, res: Response) => {
    try {
        const {country } = req.body;
        console.log(country)
        const isCountryBlocked = await blockCountry(country);

        if(isCountryBlocked){
            return  res.status(200).send('Country successfully blocked');
        }else{
            return  res.status(404).send('Error blocking country');
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
}) 

// Remove blocked country
router.delete("/countries/delete", async(req: Request, res: Response) => {
    try {
        const {id} = req.query;
        console.log(id)
        const isCountryBlocked = await removeBlockedCountry(Number(id));

        if(isCountryBlocked){
            return  res.status(200).send('Country unblocked successfully');
        }else{
            return  res.status(404).send('Error unblocking country');
        }
    } catch (err) {
        console.error(err.message);
        return res.status(500).send(err.message);
    }
}) 
export default router;
