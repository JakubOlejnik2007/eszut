import { Request, Response } from "express";
import { TAdministrator } from "../types/db-types";
import Administrator from "./db/models/administrator.helper";
import { escape as htmlEscape } from "html-escaper";

const searchForUser = async (data: TAdministrator) => {
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
}

const signin = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password) {
        
        redirectToSigninForm(req, res);
        return;
    }

    let result = await searchForUser({
        email: htmlEscape(req.body.email),
        password: htmlEscape(req.body.password),
    });

    if(result.length>0) {
        req.session.user = result[0]
        req.session.isLogged = true
        res.status(301)
        res.redirect("/eszut/dashboard")

    } else {
        redirectToSigninForm(req, res);
        return;
    }
};

export default signin;
