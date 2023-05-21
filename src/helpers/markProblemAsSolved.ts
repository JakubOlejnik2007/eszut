import { Request, Response } from "express";
import Report from "./db/models/report.helper";


const markProblemAsSolved = async (req: Request, res: Response) => {
    try {
        await Report.updateOne({_id: req.body.id}, {isSolved: true});
    } catch (error) {
        throw new Error(`[❌] ${error}`)
    }
    res.end()
}

export default markProblemAsSolved