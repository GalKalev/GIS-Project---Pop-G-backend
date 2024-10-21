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
  entities: [User, BlockedCountries, BasicFavorites, CompareFavorites],
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

export async function getBasicFavorites(id: number): Promise<BasicFavorites[] | null> {
  const basicFavoritesRepository = AppDataSource.getRepository(BasicFavorites);
  try {
    const basicFavorites = await basicFavoritesRepository
      .createQueryBuilder("basicFavorite")  // Use 'basicFavorite' as the alias for BasicFavorites
      .innerJoin("basicFavorite.user", "user")  // Join the 'user' entity
      .where("user.id = :id", { id })  // Match the email of the user
      .getMany();

    if (basicFavorites) {
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

export async function getCompareFavorites(id: number): Promise<CompareFavorites[] | null> {
  const compareFavoritesRepository = AppDataSource.getRepository(CompareFavorites);
  try {
    const compareFavorites = await compareFavoritesRepository
      .createQueryBuilder("compareFavorite")  // Use 'compareFavorite' as the alias for compareFavorites
      .innerJoin("compareFavorite.user", "user")  // Join the 'user' entity
      .where("user.id = :id", { id })  // Match the email of the user
      .getMany();

    if (compareFavorites) {
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
export async function updateUserInfo(email: string, firstName: string, lastName: string, phone: string, originCountry: string, id: number): Promise<boolean> {
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
    console.log("error updating user: " + error.message)
    return false
  }
}

/**
 * Get all users from db
 * @returns 
 */
export async function getAllUsers(): Promise<User[] | null> {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const allUsers = await userRepository
      .createQueryBuilder("user")
      .getMany()

    if (allUsers) {
      return allUsers
    }
    return null;

  } catch (error) {
    console.log("error fetching all users: " + error.message)
    return null
  }
}

/**
 * Updates the user admin status
 * @param id 
 * @param isAdmin 
 * @returns 
 */
export async function updateAdmin(id: number, isAdmin: boolean): Promise<boolean> {
  const userRepository = AppDataSource.getRepository(User);
  try {

    const updateUserAdmin = await userRepository.createQueryBuilder('user')
      .update(User)
      .set({
        isAdmin: isAdmin
      })
      .where("id = :id", { id })
      .execute();

    return true

  } catch (error) {
    console.log("error updating user admin: " + error.message)
    return false
  }
}

/**
 * Get all blocked countries from db
 * @returns 
 */
export async function getBlockedCountries(): Promise<BlockedCountries[] | null> {
  try {
    const blockedCountriesRepository = AppDataSource.getRepository(BlockedCountries);
    const blockedCountries = await blockedCountriesRepository
      .createQueryBuilder('blockedCountries')
      .getMany()

    return blockedCountries;
  } catch (error) {
    console.log("error updating user admin: " + error.message)
    return null
  }
}


/**
 * Adding a new blocked country
 * @param country 
 * @returns 
 */
export async function blockCountry(country: string): Promise<boolean> {
  try {
    const blockedCountriesRepository = AppDataSource.getRepository(BlockedCountries);
    const blockedCountry = await blockedCountriesRepository
      .createQueryBuilder('blockedCountries')
      .where('blockedCountries.country = :country', { country })
      .getOne()

    if (!blockedCountry) {
      await blockedCountriesRepository
        .createQueryBuilder()
        .insert()
        .into(BlockedCountries)
        .values({ country })
        .execute()
    }

    return true

  } catch (error) {
    console.log("error updating user admin: " + error.message)
    return false
  }
}

/**
 * Removing a blocked country
 * @param id 
 * @returns 
 */
export async function removeBlockedCountry(id: number): Promise<boolean> {
  try {
    const blockedCountriesRepository = AppDataSource.getRepository(BlockedCountries);
    console.log(id)
    const result = await blockedCountriesRepository
      .createQueryBuilder('blockedCountries')
      .where('blockedCountries.id = :id', { id }) // Ensure 'id' is correctly referenced
      .getOne();

      await AppDataSource.manager.remove(result);

      return true

  } catch (error) {
    console.log("error updating user admin: " + error.message)
    return false
  }
}

/**
 * Get the top basic favored country 
 * @returns 
 */
export async function getTopCountries(): Promise<string | null>{
  try {
    const basicFavoritesRepository = AppDataSource.getRepository(BasicFavorites);
    const topCountry = await basicFavoritesRepository
    .createQueryBuilder('favorites')
    .select('favorites.country', 'country')
    .addSelect('COUNT(favorites.country)', 'count')
    .groupBy('favorites.country')
    .orderBy('count', 'DESC')
    .limit(1) 
    .getRawOne(); 
  
  if (topCountry) {
    return topCountry.country; 
  } else {
    return 'No country found';
  }

  } catch (error) {
    console.log("error updating user admin: " + error.message)
    return null
  }
}