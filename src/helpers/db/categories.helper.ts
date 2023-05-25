require("./db_config.helper");
import { TCategory } from "../../types/db-types";
import Category from "./models/category.helper";

export const getCategories = async () => {
    try {
        const categories = await Category.find({});
        return categories;
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};

export const addCategory = async (data: TCategory) => {
    try {
        const category = new Category(data);
        await category.save();
    } catch {
        console.log("")
    }
};
