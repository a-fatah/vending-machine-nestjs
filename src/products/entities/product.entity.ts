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

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'seller' })
    seller: User;
}


type SellerName = { name: User['username'] };

export type ProductSummary = {
    name: Product['name'];
    amountAvailable: Product['amountAvailable'];
    cost: Product['cost'];
    seller: SellerName;
}
