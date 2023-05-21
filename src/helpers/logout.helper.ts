import { Request, Response } from "express"

const logout = async (req: Request, res: Response) => {
    if(req.session) req.session.destroy(()=>{})

    res.status(301)
    res.redirect("/eszut")
}

export default logout;
