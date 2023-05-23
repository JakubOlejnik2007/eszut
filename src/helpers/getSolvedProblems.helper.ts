import { Request, Response } from "express";
import Report from "./db/models/report.helper";

const fetchProblems = async (req: Request, res: Response) => {
    try {
        const result = await Report.aggregate([
            {
                $match: { isSolved: true },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "CategoryID",
                    foreignField: "_id",
                    as: "category",
                },
            },
        ]).exec();
        res.send(JSON.stringify(result));
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
    res.end();
};

export default fetchProblems;
