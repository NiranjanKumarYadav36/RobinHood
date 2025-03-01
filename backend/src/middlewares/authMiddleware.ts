import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {UserModel} from "../models/Food.model";
import { JwtPayload } from "jsonwebtoken";

// Extend the Express Request type to include 'user'
interface AuthRequest extends Request {
    user?: any;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ success: false, message: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("Decoded token:", decoded);
        (req as any).user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ success: false, message: "Invalid token." });
    }
};










// // Middleware to check authorization based on roles
// export const authorize = (roles: string[]) => {
//     return (req: Request, res: Response, next: NextFunction): void => {
//         const user = (req as any).user;
        
//         if (!user || !roles.includes(user.role)) {
//             res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
//             return;
//         }
        
//         next();
//     };
// };