import express, { Express, Request, Response } from "express";
import { engine } from "express-handlebars";
import session from "express-session";
import path from "path";

import config from "./config";
import reportForm from "./helpers/reportForm.helper";
import addNewReport from "./helpers/addNewReport.helper";
import { TAdministrator } from "./types/db-types";
import dashboard from "./helpers/dashboard.helper";
import signinForm from "./helpers/signinForm.helper";
import signin from "./helpers/signin.helper";
import logout from "./helpers/logout.helper";
import markProblemAsSolved from "./helpers/markProblemAsSolved";
import fetchProblems from "./helpers/getSolvedProblems.helper";

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

app.post("/eszut/getSolvedProblems", fetchProblems);
app.post("/eszut/markReportAsSolved", markProblemAsSolved);
app.post("/eszut/process/addNewReport", addNewReport);
app.post("/eszut/process/signin", signin);

app.listen(config.express.port, () => {
    console.log(`[⚡] Server is listening on port: ${config.express.port}!`);
});
