import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user';

// Basic Favorites table

@Entity('basicFavorites')
export class BasicFavorites extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    countryWBId!: string;

    @Column()
    minYear!: number;
    @Column()
    maxYear!: number;

    @ManyToOne(() => User, (user) => user.basicFavorites)
    user!: User;

}
