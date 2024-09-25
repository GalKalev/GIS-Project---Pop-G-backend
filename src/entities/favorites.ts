import {Entity, PrimaryColumn, Column, BaseEntity, Generated, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
import { User } from './user';

// Favorites table

@Entity('favorites')
export class Favorites extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => User, (user) => user.favorite)
    user!: User;

    @Column({type:'json'})
    basic! : Array<{country:object, minYear:string, maxYear:string}>;

    @Column({type:'json'})
    compare! :  Array<{country:object, minYear:string, maxYear:string}>;
}
