import { BasicFavorites } from "./entities/basicFavorites";
import { CompareFavorites } from "./entities/copareFavorites";

export interface IUser {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  isAdmin:boolean;
  originCountry:string;
  basicFavorites: BasicFavorites[],
  compareFavorites: CompareFavorites[],
}
