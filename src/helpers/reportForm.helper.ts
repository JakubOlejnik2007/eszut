import { Request, Response } from "express";
import { addCategory, getCategories } from "./db/categories.helper";
import mongoose from "mongoose";

const reportForm = async (req: Request, res: Response): Promise<void> => {
    let memory = req.query;
    let result = await getCategories();
    let category = result.map((x) => {
        return {
            name: String(x.name),
            id: new mongoose.Types.ObjectId(x._id),
        };
    });
    res.render("reportForm", {
        title: "Zgłoś problem!",
        category: category,
        memory: memory,
    });
};

export default reportForm;
