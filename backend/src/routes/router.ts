import express from "express"
import { authenticateJWT } from "../middlewares/authMiddleware";
import { getCities, getStates, handlLogin, logoutHandle, registerAccount, createDistributionCenter, dashBoard } from "../controller/credentials.controller";

const route = express.Router();

route.get("/protected", authenticateJWT, (req: express.Request, res: express.Response) => {
    const user = (req as any).user;
    console.log(user);
    
    res.status(200).json({ 
        success: true, 
        message: "You have access to this protected route!", 
        user: user.role,
        location: user.location || { latitude: 19.0760, longitude: 72.8777 },
        id: user.id,
        city: user.city,
        state: user.state
    });
});




route.post("/register", registerAccount)
route.post("/login", handlLogin)
route.get("/logout", logoutHandle)
route.get("/states", getStates)
route.get("/cities/:state", getCities)

route.get("/location", dashBoard)




route.post("/create", createDistributionCenter);










export default route;