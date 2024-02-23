import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    amountAvailable: number;

    @Column()
    cost: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'seller' })
    seller: User;
}
