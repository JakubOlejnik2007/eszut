import mongoose from "mongoose";
import config from "./config";
import Administrator from "./helpers/db/models/administrator.helper";

const url: string = `mongodb://${config.MongoDB.host}:${config.MongoDB.port}/${config.MongoDB.name}`;

mongoose.connect(url);

try {
    const rootAdmin = new Administrator({
        name: "root",
        password: "$2a$10$qwpawRxwtEyAgzKfoLLgCeq.ML0i0QNVRdgI.GwhR/D5ayzkCj2LC",
        email: "test@test.test"
    })
    rootAdmin.save();
    console.warn(`User created successfully!`)
} catch (error) {
    throw new Error(`[❌] ${error}`)
}