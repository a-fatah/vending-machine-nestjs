import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryColumn({ type: 'varchar', length: 255 })
    username: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'enum', enum: ['buyer', 'seller']})
    role: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    deposit: number;
}
