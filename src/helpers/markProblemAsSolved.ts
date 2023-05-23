import { Request, Response } from "express";
import Report from "./db/models/report.helper";

const markProblemAsSolved = async (req: Request, res: Response) => {
    try {
        const report = await Report.findById(req.body.id);
        console.log(report);
        if (report) {
            report.isSolved = !report.isSolved;
            await report.save();
        }
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
    res.end();
};

export default markProblemAsSolved;
