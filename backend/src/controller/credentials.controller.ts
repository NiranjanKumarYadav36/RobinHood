import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { RegionModel, UserModel, UserRole, DistributionCenterModel } from "../models/Food.model";
import  jwt from "jsonwebtoken";

config();

// Register Sponsor or Normal Volunteer
export const registerAccount = async ( req: Request, res: Response ): Promise<void> => {
  try {
    const { name, email, password, phone, role, state, city } = req.body;

    if (!name || !email || !password || !role || !state || !city) {
      res.status(400).json({ sucess:false, message: "All fields are required" });
      return;
    }

    if (![UserRole.SPONSOR, UserRole.VOLUNTEER, UserRole.VOLUNTEER_T2].includes(role)) {
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

export const handlLogin = async ( req: Request, res: Response ): Promise<void> => {
  try {
    const { email, password}  = req.body

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" })
      return;
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ sucess: false, message: "Invalid email or password" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ sucess: false, message: "Invalid email or password" });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, state: user.state, city: user.city },
      process.env.JWT_SECRET as string,
      {expiresIn: '1h'}
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.status(200).json({ success: true, message: "Login successful", token: token, user: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const logoutHandle = async( req: Request, res: Response ): Promise<void> => {
  try {
    res.clearCookie("token"), {
      path: "/",
      httpOnly: true,
      sameSite: "Lax"
    }

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(404).json({sucess: false, message: error})
  }
};

export const getStates = async ( req: Request, res: Response): Promise<void> => {
  try {
    const state = await RegionModel.distinct("state")
    res.status(200).json(state)
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCities = async ( req: Request, res: Response): Promise<void> => {
  try {
    const { state} = req.params

    const cities = await RegionModel.find({ state }).distinct("city")

    if (!cities.length) {
      res.status(404).json({ message: "No cities found for this state" });
      return;
    }

    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createDistributionCenter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, state, city, admin } = req.body;

    if (!name || !state || !city || !admin) {
      res.status(400).json({ success: false, message: "All fields are required." });
      return;
    }

    const newDC = new DistributionCenterModel({ name, state, city, admin });
    await newDC.save();

    res.status(201).json({ success: true, message: "Distribution Center created successfully!", data: newDC });
} catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
}
};


export const dashBoard = async (req: Request, res: Response): Promise<void> => {
  try {
    let { role } = req.params;
    role = role.toLowerCase() // Ensure lowercase comparison

    // Validate role input
    if (!Object.values(UserRole).includes(role as UserRole)) {
      res.status(400).json({ message: "Invalid role provided" });
      return;
    }

    let data;

    switch (role) {
      case UserRole.SPONSOR:
        data = await UserModel.find({ role: UserRole.SPONSOR }).select("-password");
        break;

      case UserRole.VOLUNTEER:
        data = await UserModel.find({ role: UserRole.VOLUNTEER }).select("-password");
        break;

      case UserRole.VOLUNTEER_T2:
        data = await UserModel.find({ role: UserRole.VOLUNTEER_T2 }).select("-password");
        break;

      case UserRole.DC_ADMIN:
        data = await UserModel.find({ role: UserRole.DC_ADMIN }).select("-password");
        break;

      case "distribution_centers":
        data = await DistributionCenterModel.find({});
        break;

      default:
        res.status(400).json({ message: "Invalid role type" });
        return;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

