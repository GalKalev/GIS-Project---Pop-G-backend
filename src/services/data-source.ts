import 'dotenv/config';
import 'reflect-metadata';
import { User } from '../entities/user';
import { BlockedCountries } from '../entities/blockedCountries';
import { DataSource } from "typeorm";
import { BasicFavorites } from '../entities/basicFavorites';
import { CompareFavorites } from '../entities/compareFavorites';

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
 * @param id 
 * @returns 
 */

export async function getBasicFavorites(id: number): Promise<BasicFavorites[]| null> {
  const basicFavoritesRepository = AppDataSource.getRepository(BasicFavorites);
  try {
    const basicFavorites = await basicFavoritesRepository
    .createQueryBuilder("basicFavorite")  // Use 'basicFavorite' as the alias for BasicFavorites
    .innerJoin("basicFavorite.user", "user")  // Join the 'user' entity
    .where("user.id = :id", { id })  // Match the email of the user
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
 * @param id 
 * @returns 
 */

export async function getCompareFavorites(id: number): Promise<CompareFavorites[]| null> {
  const compareFavoritesRepository = AppDataSource.getRepository(CompareFavorites);
  try {
    const compareFavorites = await compareFavoritesRepository
    .createQueryBuilder("compareFavorite")  // Use 'compareFavorite' as the alias for compareFavorites
    .innerJoin("compareFavorite.user", "user")  // Join the 'user' entity
    .where("user.id = :id", { id })  // Match the email of the user
    .getMany();

      if(compareFavorites ){
        return compareFavorites
      }
    return null;
  } catch (error) {
    throw new Error("Error finding user's favorite by email: " + error);
  }
}

/**
 * Updates user info in db
 * @param email 
 * @param firstName 
 * @param lastName 
 * @param phone 
 * @param originCountry 
 * @param id 
 * @returns 
 */
export async function updateUserInfo(email:string,firstName:string, lastName:string, phone:string, originCountry:string, id:number):Promise<boolean>{
  const userRepository = AppDataSource.getRepository(User);
  try {
    const updateInfo = await userRepository.createQueryBuilder("user")
    .update(User)
    .set({
      email: email,
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      originCountry: originCountry,
    })
    .where("id = :id", { id })
    .execute();

    return true
  } catch (error) {
    console.log("error updating user: " +error.message)
    return false
  }
}