import dotenv from "dotenv";
import { TConfigData } from "./types/config-type";

dotenv.config();

const { EXPRESS_PORT, MONGO_DB_IP, MONGO_DB_PORT, MONGO_DB_NAME, MAIL_SERVICE, MAIL_USER, MAIL_PASS } = process.env;

const config: TConfigData = {
    express: {
        port: Number(EXPRESS_PORT),
    },
    MongoDB: {
        host: String(MONGO_DB_IP),
        port: Number(MONGO_DB_PORT),
        name: String(MONGO_DB_NAME),
    },
    mail: {
        service: String(MAIL_SERVICE),
        user: String(MAIL_USER),
        pass: String(MAIL_PASS),
    },
};
export default config;
