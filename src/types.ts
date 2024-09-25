import { Favorites } from "./entities/favorites";

export interface IUser {
  firstName: string;
  lastName: string;
  phone: string;
  userId: string;
  email: string;
  password: string;
//   favorites:Favorites;
  isAdmin:boolean;
  originCountry:string;
}
