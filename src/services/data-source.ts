import 'dotenv/config';
import 'reflect-metadata';
import { Favorites } from '../entities/favorites';
import { User } from '../entities/user';
import { DataSource } from "typeorm";

const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
    type: "postgres",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB,
    schema: process.env.SCHEMA,
    entities: [User, Favorites],
    synchronize: true,
    ssl: {
      rejectUnauthorized: false, // Set to true if you have a valid SSL certificate
    },

   migrations: [`${__dirname}/**/migrations/*.{ts,js}`]
})

/**
 * Checks if the given username exists in DB
 * @param email
 * @returns user
 */
export async function findUserByEmail(
  email: string
): Promise<User | null> {
  const userRepository = AppDataSource.getRepository(User);
  try {
    const user = await userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .getOne();
    return user || null;
  } catch (error) {
    throw new Error("Error finding user by email " + error);
  }
}
