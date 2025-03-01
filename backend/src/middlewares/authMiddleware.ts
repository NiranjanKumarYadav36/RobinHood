import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {UserModel} from "../models/Food.model";
import { JwtPayload } from "jsonwebtoken";

// Middleware to authenticate user using JWT
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        res.status(401).json({ message: "Access Denied. No Token Provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }

        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

// Middleware to check authorization based on roles
export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;
        
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
            return;
        }
        
        next();
    };
};