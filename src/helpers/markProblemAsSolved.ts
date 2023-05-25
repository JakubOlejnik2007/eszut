import { Request, Response } from "express";
import Report from "./db/models/report.helper";

const markProblemAsSolved = async (req: Request, res: Response) => {
    try {
        const report = await Report.findById(req.body.id);
        if (report) {
            report.isSolved = !report.isSolved;
            report.AdministratorWhoSolvedID = req.session.user?._id;
            report.dateOfSolved = Date.now();
            await report.save();
        }
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
    res.end();
};

export default markProblemAsSolved;
