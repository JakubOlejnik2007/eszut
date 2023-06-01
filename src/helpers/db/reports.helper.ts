require("./db_config.helper");
import { TReport } from "../../types/db-types";
import Report from "./models/report.helper";
import { Request, Response } from "express"
import mongoose from "mongoose";
import { escape as htmlEscape } from "html-escaper"
import { sendNotifications } from "../notifications.helper";
import sendMails from "../mailing.helper";

export const addReport = async (data: TReport):Promise<boolean> => {
    try {
        const report = new Report(data);
        await report.save();
        return true
    } catch (error) {
        return false
    }
}


export const addNewReport = async (req: Request, res: Response) => {
    if(!req.body.where || !req.body.who || !req.body.what || !req.body.category) {
        let url = `/eszut?success=0`

        if (req.body.where) {
            url += `&where=${encodeURIComponent(htmlEscape(req.body.where))}`;
          }
          if (req.body.who) {
            url += `&who=${encodeURIComponent(htmlEscape(req.body.who))}`;
          }
          if (req.body.what) {
            url += `&what=${encodeURIComponent(htmlEscape(req.body.what))}`;
          }
          if (req.body.category) {
            url += `&category=${encodeURIComponent(htmlEscape(req.body.category))}`;
          }

        res.redirect(url);
        res.status(301)
        return 0;
    }

    let report: TReport = {
        _id: new mongoose.Types.ObjectId(),
        where: htmlEscape(req.body.where),
        who: htmlEscape(req.body.who),
        what: htmlEscape(req.body.what),
        when: Date.now(),
        isSolved: false,
        CategoryID: new mongoose.Types.ObjectId(htmlEscape(req.body.category))
    }

    let response = await addReport(report);
    if(response){
        sendMails(report)
        sendNotifications();
        res.status(201)
        res.redirect(`/eszut/?success=1&reportid=${report._id}`);
    } else {
        res.status(304)
        res.redirect("/eszut/?success=0")
    }

}

export const fetchSolvedProblems = async (req: Request, res: Response) => {
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
            { $unwind: "$category"},
            {
                $lookup: {
                    from: "administrators",
                    localField: "AdministratorWhoSolvedID",
                    foreignField: "_id",
                    as: "admin",
                },
            },
            { $unwind: "$admin"},

        ]).sort({
            when:-1
        }).exec();
        res.send(JSON.stringify(result));
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
    res.end();
};

export const markProblemAsSolved = async (req: Request, res: Response) => {
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

export const fetchProblems = async () => {
    try {
        const result = await Report.aggregate([
            {
                $match: { isSolved: false },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "CategoryID",
                    foreignField: "_id",
                    as: "category",
                },
            },
        ])
            .sort({ when: -1 })
            .exec();
        return result;
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};