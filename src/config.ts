import dotenv from "dotenv";
import { TConfigData } from "./types/config-type";

dotenv.config();

const {
    EXPRESS_PORT,
    MONGO_DB_IP,
    MONGO_DB_PORT,
    MONGO_DB_NAME,
} = process.env;

const config: TConfigData = {
    express: {
        port: Number(EXPRESS_PORT)
    },
    MongoDB: {
        host: String(MONGO_DB_IP),
        port: Number(MONGO_DB_PORT),
        name: String(MONGO_DB_NAME),
    }
};
export default config;
