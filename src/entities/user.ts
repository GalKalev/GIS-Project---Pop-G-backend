import {
    Entity,
    PrimaryColumn,
    Column,
    BaseEntity,
    JoinColumn,
    Generated,
    OneToOne,
} from "typeorm";
import { Favorites } from "./favorites";

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

    @OneToOne(() => Favorites, (favorites) => favorites.user, { nullable: true })
    @JoinColumn() // This will create a foreign key in the favorites table pointing back to user
    favorite?: Favorites;

    @Column()
    originCountry!: string

}
