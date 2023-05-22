import { TReport } from "../types/db-types";
import Administrator from "./db/models/administrator.helper";
import nodemailer from "nodemailer";

const getAdminMails = async () => {
    try {
        let emails:any = await Administrator.find({}, 'email');
        emails = emails.map((x: any) => x.email)
        console.log(emails)
        return emails
    } catch (error) {
        throw new Error(`[❌] ${error}`)
    }
}

const sendMails = async (report: TReport) => {
    const mails = await getAdminMails();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'jacobole2000@gmail.com',
          
        }
      });
    mails.forEach((mail:any) => {
        const mailOptions = {
            from: 'jacobole2000@gmail.com',
            to: mail,
            subject: `Nowe zgłoszenie: ${report._id}`,
            text: JSON.stringify(report)
          };
        
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
            } else {
              console.log('E-mail został wysłany:', info.response);
            }
          });
    });

}

export default sendMails