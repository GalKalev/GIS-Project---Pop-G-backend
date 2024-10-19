import express, { Express, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./services/data-source";
import loginRouter from "./routes/login";
import registerRouter from "./routes/register";
import favoritesRouter from './routes/favorites'
import userInfoRouter from './routes/userInfo'
import adminRouter from './routes/admin'
import cors from 'cors';


dotenv.config();

const app: Express = express();
app.use(cors({
    origin: '*'
  }));

app.use(express.json());

app.use("/login", loginRouter);
app.use("/register", registerRouter);
app.use("/favorites", favoritesRouter);
app.use("/userInfo", userInfoRouter)
app.use("/admin",adminRouter)

const port = process.env.PORT;

const main = async () => {
    try {
        await AppDataSource.initialize();

        console.log("Connected to Postgres");
    } catch (err) {
        if (err instanceof Error) {
            if ((err as any).code === "ECONNRESET") {
                console.error("Connection reset by peer. Retrying...");
                // You might want to implement retry logic here
            } else {
                console.error("Database connection error:", err.message);
            }
        } else {
            console.error("An unexpected error occurred:", err);
        }
    }
};

main();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});