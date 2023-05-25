import { Request, Response } from "express";
import { TAdministrator } from "../types/db-types";
import Administrator from "./db/models/administrator.helper";
import { escape as htmlEscape } from "html-escaper";
import bcrypt from "bcrypt";

const searchForUser = async (data: TAdministrator | any) => {
    try {
        const user = await Administrator.find(data);
        return user;
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};

const redirectToSigninForm = (req: Request, res: Response) => {
    let url = `/eszut/signin?success=0`;

    if (req.body.email) {
        url += `&email=${encodeURIComponent(req.body.email)}`;
    }
    res.redirect(url);
    res.status(301);
};

const signin = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
        redirectToSigninForm(req, res);
        return;
    }

    const user = await searchForUser({
        email: htmlEscape(req.body.email),
    });

    if (user.length > 0) {
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (match) {
            req.session.user = user[0];
            req.session.isLogged = true;
            res.status(301);
            res.redirect("/eszut/dashboard");
        } else {
            redirectToSigninForm(req, res);
            return;
        }
    } else {
        redirectToSigninForm(req, res);
        return;
    }
};
export default signin;