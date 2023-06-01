import express, { Express, Request, Response } from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import path from "path";

import config from "./config";
import reportForm from "./helpers/reportForm.helper";
import { TAdministrator } from "./types/db-types";
import dashboard from "./helpers/dashboard.helper";
import { signinForm, signin} from "./helpers/signin.helper";
import logout from "./helpers/logout.helper";
import { subscribe } from "./helpers/notifications.helper";
import { changeEmail, changePassword, promoteNewAdmin, removeAdmin } from "./helpers/profileActions.helper";
import { addNewReport, fetchSolvedProblems, markProblemAsSolved } from "./helpers/db/reports.helper";
import { addCategory } from "./helpers/db/categories.helper";

const app: Express = express();

declare module "express-session" {
    interface SessionData {
        isLogged: boolean;
        user: TAdministrator;
    }
}

app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);

app.use(express.static(path.join(__dirname, "static")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    "hbs",
    engine({
        extname: "hbs",
        defaultLayout: "main",
        layoutsDir: path.join(__dirname, "hbs", "layouts"),
        partialsDir: path.join(__dirname, "hbs", "partials"),
        helpers: {
            ifCond: function (v1: any, operator: any, v2: any): any {
                switch (operator) {
                    case "==":
                        return v1 == v2;
                    case "===":
                        return v1 === v2;
                    case "!=":
                        return v1 != v2;
                    case "!==":
                        return v1 !== v2;
                    case "<":
                        return v1 < v2;
                    case "<=":
                        return v1 <= v2;
                    case ">":
                        return v1 > v2;
                    case ">=":
                        return v1 >= v2;
                    case "&&":
                        return v1 && v2;
                    case "||":
                        return v1 || v2;
                    default:
                        return false;
                }
            },
        },
    })
);
app.set("view engine", "hbs");

app.set("views", path.join(__dirname, "hbs/views"));

app.get("/eszut/", reportForm);
app.get("/eszut/dashboard", dashboard);
app.get("/eszut/signin", signinForm);
app.get("/eszut/logout", logout);

app.post("/eszut/getSolvedProblems", fetchSolvedProblems);
app.post("/eszut/markReportAsSolved", markProblemAsSolved);
app.post("/eszut/process/addNewReport", addNewReport);
app.post("/eszut/process/signin", signin);
app.post("/eszut/process/addCategory", addCategory)
app.post("/eszut/process/changePassword", changePassword);
app.post("/eszut/process/changeEmail", changeEmail);
app.post("/eszut/process/promoteNewAdmin", promoteNewAdmin);
app.post("/eszut/process/removeAdmin", removeAdmin);


app.post("/eszut/subscribe", subscribe)
//app.post("/eszut/send-notification", sendNotifications)

app.listen(config.express.port, () => {
    console.log(`[⚡] Server is listening on port: ${config.express.port}!`);
});
