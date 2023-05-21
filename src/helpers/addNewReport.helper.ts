import { Request, Response } from "express"
import { TReport } from "../types/db-types";
import mongoose from "mongoose";
import { addReport } from "./db/reports.helper";
import { escape as htmlEscape } from "html-escaper"
import sendMails from "./mailing.helper";

const addNewReport = async (req: Request, res: Response) => {
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
        res.status(201)
        res.redirect(`/eszut/?success=1&reportid=${report._id}`);
    } else {
        res.status(304)
        res.redirect("/eszut/?success=0")
    }

}

export default addNewReport