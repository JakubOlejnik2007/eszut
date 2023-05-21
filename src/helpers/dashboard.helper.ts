import { Request, Response } from "express"
import Report from "./db/models/report.helper";
import { TCategory, TReport } from "../types/db-types";
import Category from "./db/models/category.helper";

const fetchProblems = async () => {
    try {
        const result = await Report.aggregate([
            {
                $match: {isSolved: false}
            },
            {
              $lookup: {
                from: 'categories',
                localField: 'CategoryID',
                foreignField: '_id',
                as: 'category'
              }
            }
          ]).exec();
          return result
    } catch (error) {
        throw new Error(`[❌] ${error}`)
    }
}


const dashboard = async (req: Request, res: Response) => {
    try {
        /*if(!req.session.isLogged){
            res.status(301)
            res.redirect("/eszut/signin")
            return;
        }*/


        let result:any = await fetchProblems();
        result = result.map((x: TReport & {category: TCategory[]} ) => {
            return {
                id: x._id,
                where: x.where,
                who: x.who,
                what: x.what,
                whenfixed: x.when,
                when: new Date(x.when ? x.when.valueOf() : 0 ).toLocaleDateString('pl'),
                category: x.category[0].name
            }
        })
        res.render("dashboard", {
            title: "Dashboard",
            data: result

        })

    } catch (error) {
        res.status(301)
        res.redirect("/eszut/")
    }
}

export default dashboard;