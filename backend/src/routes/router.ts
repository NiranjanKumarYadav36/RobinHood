import express from "express"
import { authenticateJWT } from "../middlewares/authMiddleware";

const route = express.Router();

route.get("/protected", authenticateJWT, (req: express.Request, res: express.Response) => {
    const user = (req as any).user;
    console.log(user);
    
    res.status(200).json({ success: true, message: "You have access to this protected route!", user: user.role });
});

export default route;