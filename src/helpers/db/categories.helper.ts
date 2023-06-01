require("./db_config.helper");
import { Request, Response } from "express"
import { TCategory } from "../../types/db-types";
import Category from "./models/category.helper";

const redirectToDashboardWithFail = (res: Response) => {
    res.redirect("/eszut/dashboard?success=0");
    res.end();
};

const redirectToDashboardWithSuccess = (res: Response) => {
    res.redirect("/eszut/dashboard?success=1");
    res.end();
};


export const getCategories = async () => {
    try {
        const categories:any = await Category.find({});
        return categories.map((x: TCategory) => {
            return {
                _id: x._id,
                name: x.name
            }
        });
    } catch (error) {
        console.log(error)
    }
};

export const addCategory = async (req: Request, res: Response) => {
    if(!req.body.category){
        redirectToDashboardWithFail(res); return;
    }



    try {
        const category = new Category({
            name: req.body.category
        });
        await category.save();
        redirectToDashboardWithSuccess(res);
    } catch (error) {
        redirectToDashboardWithFail(res);
        console.log(error)
    }

};
