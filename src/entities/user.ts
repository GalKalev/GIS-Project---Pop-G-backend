import {
    Entity,
    PrimaryColumn,
    Column,
    BaseEntity,
    Generated,
    OneToMany,
} from "typeorm";
import { BasicFavorites } from "./basicFavorites";
import { CompareFavorites } from "./copareFavorites";

// User table

@Entity("user")
export class User extends BaseEntity {
    @Column()
    @Generated("increment")
    id!: number;

    @PrimaryColumn()
    email!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    phone!: string;

    @Column()
    password!: string;

    @Column()
    isAdmin!: boolean;

    @OneToMany(() => BasicFavorites, (basicFavorites) => basicFavorites.user, { cascade: true })
    basicEntries!: BasicFavorites[];

    @OneToMany(() => CompareFavorites, (compareFavorites) => compareFavorites.user, { cascade: true })
    compareFavorites!: CompareFavorites[];

    @Column()
    originCountry!: string

}
