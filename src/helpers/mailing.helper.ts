import config from "../config";
import { TReport } from "../types/db-types";
import Administrator from "./db/models/administrator.helper";
import nodemailer from "nodemailer";

const getAdminMails = async () => {
    try {
        let emails: any = await Administrator.find({}, "email");
        emails = emails.map((x: any) => x.email);
        console.log(emails);
        return emails;
    } catch (error) {
        throw new Error(`[❌] ${error}`);
    }
};

const sendMails = async (report: TReport) => {
    const mails = await getAdminMails();

    const transporter = nodemailer.createTransport({
        service: config.mail.service,
        auth: {
            user: config.mail.user,
            pass: config.mail.pass,
        },
    });
    mails.forEach((mail: any) => {
        const mailOptions = {
            from: config.mail.user,
            to: mail,
            subject: `Nowe zgłoszenie: ${report._id}`,
            text: JSON.stringify(report),
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
