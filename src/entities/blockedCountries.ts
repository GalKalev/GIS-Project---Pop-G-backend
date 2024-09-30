import {Entity, PrimaryColumn, Column, BaseEntity, Generated, PrimaryGeneratedColumn, OneToOne} from 'typeorm';
// Blocked countries table --only admin can modify the content of this table--

@Entity('blockedCountries')
export class BlockedCountries extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({unique:true})
    country!:string;
}
