import { compare, hash } from "bcrypt";
import { Response, Request } from "express";
import Administrator from "./db/models/administrator.helper";
import { escape as htmlEscape } from "html-escaper";
import { TAdministrator } from "../types/db-types";
import { sendMailsAboutActions } from "./mailing.helper";
import mongoose from "mongoose";

const emailRegExp: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const validate = (toValidate: string, validator: RegExp) => {
    return validator.test(toValidate);
};

const redirectToDashboardWithFail = (res: Response) => {
    res.redirect("/eszut/dashboard?success=0");
    res.end();
};

const redirectToDashboardWithSuccess = (res: Response) => {
    res.redirect("/eszut/dashboard?success=1");
    res.end();
};

export const changePassword = async (req: Request, res: Response) => {
    if (!req.body.newPassword || !req.body.confirmPassword || !req.session.user) {
        redirectToDashboardWithFail(res);
        return;
    }
    if (await compare(req.body.confirmPassword, req.session.user.password.valueOf())) {
        try {
            let admin = await Administrator.findOne({
                _id: req.session.user._id,
            });
            if (!admin) redirectToDashboardWithFail(res);
            else {
                admin.password = (await hash(htmlEscape(req.body.newPassword), 10)).valueOf();
                await admin.save();
                req.session.user = admin;
                redirectToDashboardWithSuccess(res);
            }
        } catch {
            redirectToDashboardWithFail(res);
        }
    }
};

export const changeEmail = async (req: Request, res: Response) => {
    if (!req.body.newEmail || !req.body.confirmPassword || !req.session.user) {
        redirectToDashboardWithFail(res);
        return;
    }
    if (
        !validate(req.body.newEmail, emailRegExp) ||
        !(await compare(req.body.confirmPassword, req.session.user.password.valueOf()))
    ) {
        redirectToDashboardWithFail(res);
        return;
    }
    if (req.session.user) {
        try {
            let admin = await Administrator.findOne({
                _id: req.session.user._id,
            });
            console.log(admin);
            if (!admin) redirectToDashboardWithFail(res);
            else {
                admin.email = htmlEscape(req.body.newEmail);
                await admin.save();
                req.session.user = admin;
                redirectToDashboardWithSuccess(res);
            }
        } catch (error) {
            redirectToDashboardWithFail(res);
        }
    }
};

export const promoteNewAdmin = async (req: Request, res: Response) => {
    if (
        !req.body.adminName ||
        !req.body.adminEmail ||
        !req.body.adminPassword ||
        !req.body.confirmPassword ||
        !req.session.user
    ) {
        redirectToDashboardWithFail(res);
        return;
    }
    if (
        !validate(req.body.adminEmail, emailRegExp) ||
        !(await compare(req.body.confirmPassword, req.session.user.password.valueOf()))
    ) {
        redirectToDashboardWithFail(res);
        return;
    }

    try {
        let admin = new Administrator({
            _id: new mongoose.Types.ObjectId(),
            name: htmlEscape(req.body.adminName),
            email: htmlEscape(req.body.adminEmail),
            //          (await hash(htmlEscape(req.body.newPassword), 10)).valueOf()
            password: (await hash(htmlEscape(req.body.adminPassword), 10)).valueOf()
        });
        await admin.save();
        redirectToDashboardWithSuccess(res);
        console.log(admin)
        sendMailsAboutActions(req.session.user, false, admin)
    } catch (error) {
        redirectToDashboardWithFail(res);
    }
};

export const removeAdmin = async (req: Request, res: Response) => {
    if(!req.body.admin || !req.body.confirmPassword || !req.session.user) {
        redirectToDashboardWithFail(res);
        return;
    }
    if(!(await compare(req.body.confirmPassword, req.session.user.password.valueOf())) || req.body.admin == req.session.user._id){
        redirectToDashboardWithFail(res)
        return;
    }

    try {
        let removedAdmin = await Administrator.findOneAndDelete({
            _id: req.body.admin
        })
        if(!removedAdmin){
            redirectToDashboardWithFail(res); return;
        }
        redirectToDashboardWithSuccess(res)
        console.log(removedAdmin)
        sendMailsAboutActions(req.session.user, false, removedAdmin)
    } catch {
        redirectToDashboardWithFail(res)
    }
};
