import config from "../config";
import { TReport } from "../types/db-types";
import Administrator from "./db/models/administrator.helper";
import nodemailer from "nodemailer";
import { create } from "express-handlebars";

import * as exphbs from "express-handlebars";
import nodemailerHbs from "nodemailer-express-handlebars";
import * as path from "path";
import mongoose from "mongoose";
import Category from "./db/models/category.helper";

const transporter = nodemailer.createTransport({
    service: config.mail.service,
    auth: {
        user: config.mail.user,
        pass: config.mail.pass,
    },
});

const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    partialsDir: path.resolve(__dirname, '../hbs/partials'),
    layoutsDir: path.resolve(__dirname, '../hbs/layouts'),
  });
  
  // Ustawienie silnika szablonów Handlebars dla Nodemailer
  transporter.use(
    'compile',
    nodemailerHbs({
      viewEngine: hbs,
      viewPath: path.resolve(__dirname, '../hbs/views'),
      extName: '.hbs', // Dodaj to pole, aby używać rozszerzenia .hbs
    })
  );

const getAdminMails = async () => {
    try {
        let emails: any = await Administrator.find({}, "email");
        emails = emails.map((x: any) => x.email);
        return emails;
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};

const getCategoryName = async (CategoryID: mongoose.Schema.Types.ObjectId) => {
    try {
        let category: any = await Category.find({"_id": CategoryID}, "name");
        category = category.map((x: any) => x.name);
        return category;
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};

const sendMails = async (report: TReport) => {
    const mails = await getAdminMails();
    let contentToSend: any = report;
    contentToSend.when = new Date(contentToSend.when ? contentToSend.when.valueOf() : 0 ).toLocaleString('pl');
    contentToSend.category = await getCategoryName(contentToSend.CategoryID);
    mails.forEach((mail: any) => {
        const mailOptions = {
            from: config.mail.user,
            to: mail,
            subject: `Nowe zgłoszenie: ${report._id}`,
            template: "email",
            context: contentToSend
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log("E-mail został wysłany:", info.response);
            }
        });
    });
};

export default sendMails;
