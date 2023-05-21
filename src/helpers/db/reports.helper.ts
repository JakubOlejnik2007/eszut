require("./db_config.helper");
import { TReport } from "../../types/db-types";
import Report from "./models/report.helper";


export const addReport = async (data: TReport):Promise<boolean> => {
    try {
        const report = new Report(data);
        await report.save();
        return true
    } catch (error) {
        return false
    }
}