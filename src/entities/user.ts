import {
    Entity,
    Column,
    BaseEntity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { BasicFavorites } from "./basicFavorites";
import { CompareFavorites } from "./compareFavorites"

// User table

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("increment")
    id!: number;

    @Column({unique:true})
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
    basicFavorites!: BasicFavorites[];

    @OneToMany(() => CompareFavorites, (compareFavorites) => compareFavorites.user, { cascade: true })
    compareFavorites!: CompareFavorites[];

    @Column()
    originCountry!: string

}
