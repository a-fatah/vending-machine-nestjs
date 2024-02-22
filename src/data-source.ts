import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "dev",
    password: "s3cr3t",
    database: "restful-vending-machine",
    synchronize: true,
    logging: true,
    subscribers: [],
    migrations: [],
})
