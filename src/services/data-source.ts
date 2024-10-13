import 'dotenv/config';
import 'reflect-metadata';
import { User } from '../entities/user';
import { BlockedCountries } from '../entities/blockedCountries';
import { DataSource } from "typeorm";
import { BasicFavorites } from '../entities/basicFavorites';
import { CompareFavorites } from '../entities/copareFavorites';

const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
    type: "postgres",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB,
    schema: process.env.SCHEMA,
    entities: [User,BlockedCountries, BasicFavorites, CompareFavorites],
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

/**
 * Returns the user basic favorites data
 * @param email 
 * @returns 
 */

export async function getBasicFavorites(email: string): Promise<BasicFavorites[]| null> {
  const basicFavoritesRepository = AppDataSource.getRepository(BasicFavorites);
  // const compareFavoritesRepository = AppDataSource.getRepository(CompareFavorites);
  const userRepository = AppDataSource.getRepository(User);
  try {
    const basicFavorites = await basicFavoritesRepository
    .createQueryBuilder("basicFavorite")  // Use 'basicFavorite' as the alias for BasicFavorites
    .innerJoin("basicFavorite.user", "user")  // Join the 'user' entity
    .where("user.email = :email", { email })  // Match the email of the user
    .getMany();

      if(basicFavorites ){
        return basicFavorites
      }
    return null;
  } catch (error) {
    throw new Error("Error finding user's favorite by email: " + error);
  }
}

/**
 * Returns the user compare favorites data
 * @param email 
 * @returns 
 */

export async function getCompareFavorites(email: string): Promise<CompareFavorites[]| null> {
  const compareFavoritesRepository = AppDataSource.getRepository(CompareFavorites);
  // const compareFavoritesRepository = AppDataSource.getRepository(CompareFavorites);
  const userRepository = AppDataSource.getRepository(User);
  try {
    const compareFavorites = await compareFavoritesRepository
    .createQueryBuilder("compareFavorite")  // Use 'compareFavorite' as the alias for compareFavorites
    .innerJoin("compareFavorite.user", "user")  // Join the 'user' entity
    .where("user.email = :email", { email })  // Match the email of the user
    .getMany();

      if(compareFavorites ){
        return compareFavorites
      }
    return null;
  } catch (error) {
    throw new Error("Error finding user's favorite by email: " + error);
  }
}


