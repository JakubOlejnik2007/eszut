import { Request, Response } from "express";
import Report from "./db/models/report.helper";
import { TAdministrator, TCategory, TReport } from "../types/db-types";
import Category from "./db/models/category.helper";
import Administrator from "./db/models/administrator.helper";

const fetchProblems = async () => {
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

const getAdminList = async () => {
    try {
        let admins: any = await Administrator.find();
        admins = admins.map((x: TAdministrator) => {
            return {
                _id: x._id,
                name: x.name,
            };
        });
        return admins
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};

const dashboard = async (req: Request, res: Response) => {
    try {
        if (!req.session.isLogged) {
            res.status(301);
            res.redirect("/eszut/signin");
            return;
        }

        let result: any = await fetchProblems();
        result = result.map((x: TReport & { category: TCategory[] }) => {
            return {
                id: x._id,
                where: x.where,
                who: x.who,
                what: x.what,
                whenfixed: x.when,
                when: new Date(x.when ? x.when.valueOf() : 0).toLocaleString("pl"),
                category: x.category[0].name,
            };
        });
        res.render("dashboard", {
            title: "Dashboard",
            data: result,
            user: req.session.user,
            admins: await getAdminList(),
            memory: req.query
        });
    } catch (error) {
        res.status(301);
        res.redirect("/eszut/");
    }
};

export default dashboard;
