import { DataSource } from "typeorm";
import { User } from "./user/entities/user.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dev",
    password: "s3cr3t",
    database: "nestjs-demo",
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
})
