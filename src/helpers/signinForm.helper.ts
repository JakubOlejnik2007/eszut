import { Request, Response } from "express"

const signinForm = async (req: Request, res: Response) => {
    try {
        if(req.session.isLogged) {
            res.status(301);
            res.redirect("/eszut/dashboard");
        } else {
            res.render("signinForm", {
                title: "Zaloguj się",
                memory: req.query
            });
        }
    } catch (error) {
        res.status(301)
        res.redirect("/eszut")
    }
}

export default signinForm;