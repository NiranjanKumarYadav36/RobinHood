import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { UserModel, UserRole } from "../models/Food.model";

config();

// Register Sponsor or Normal Volunteer
export const registerAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role, state, city } = req.body;

    if (!name || !email || !password || !role || !state || !city) {
      res.status(400).json({ sucess:false, message: "All fields are required" });
      return;
    }

    if (![UserRole.SPONSOR, UserRole.VOLUNTEER].includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ name, email, password: hashedPassword, phone, role, state, city });

    await user.save();
    res.status(201).json({ sucess: true, message: "User registered successfully", user: { name, email, role, state, city } });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};