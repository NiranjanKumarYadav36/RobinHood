import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
import { RegionModel, UserModel, UserRole, DistributionCenterModel, FoodRequestModel } from "../models/Food.model";
import jwt from "jsonwebtoken";

config();

// Register Sponsor or Normal Volunteer
export const registerAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, role, state, city } = req.body;

    if (!name || !email || !password || !role || !state || !city) {
      res.status(400).json({ sucess: false, message: "All fields are required" });
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

export const handlLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

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
      { expiresIn: '1h' }
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

export const logoutHandle = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token"), {
      path: "/",
      httpOnly: true,
      sameSite: "Lax"
    }

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(404).json({ sucess: false, message: error })
  }
};

export const getStates = async (req: Request, res: Response): Promise<void> => {
  try {
    const state = await RegionModel.distinct("state")
    res.status(200).json(state)
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getCities = async (req: Request, res: Response): Promise<void> => {
  try {
    const { state } = req.params

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
    let { role, city, state } = req.query;

    if (!role || !city || !state) {
      res.status(400).json({ message: "Missing required parameters: role, city, or state" });
      return;
    }

    role = (role as string).toLowerCase();

    let data;

    switch (role) {
      case UserRole.VOLUNTEER_T2:
        // Find sponsors in the given state or Maharashtra
        const sponsors = await UserModel.find({
          role: UserRole.SPONSOR,
          state: { $in: [state, "Maharashtra"] },
        }).select("-password");

        // Find food requests from those sponsors
        const sponsorIds = sponsors.map(sponsor => sponsor._id);
        const foodRequests = await FoodRequestModel.find({ sponsor: { $in: sponsorIds } });

        data = {
          volunteers: await UserModel.find({ role: UserRole.VOLUNTEER, city }).select("-password"),
          sponsors,
          distributionCenters: await DistributionCenterModel.find({ city }),
          foodRequests, // Added food request details
        };
        break;

      case UserRole.VOLUNTEER:
        data = {
          volunteers: await UserModel.find({ role: UserRole.VOLUNTEER, city }).select("-password"),
          distributionCenters: await DistributionCenterModel.find({ city }),
        };
        break;

      case UserRole.SPONSOR:
        data = {
          distributionCenters: await DistributionCenterModel.find({ city }),
        };
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


export const createFoodRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, foodName, description, expiry } = req.body;

    console.log("Uploaded Files:", req.files);

    if (!userId || !foodName || !expiry) {
      res.status(400).json({ message: "User ID, food name, and expiry date are required." });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { city, state, location } = user;
    if (!location || !location.latitude || !location.longitude) {
      res.status(400).json({ message: "User location is missing" });
      return;
    }

    // ✅ Store relative file paths
    const uploadedImages = req.files ? (req.files as Express.Multer.File[]).map(file => `uploads/${file.filename}`) : [];

    if (uploadedImages.length === 0) {
      res.status(400).json({ message: "At least one image is required." });
      return;
    }

    const foodRequest = await FoodRequestModel.create({
      sponsor: userId,
      foodName,
      images: uploadedImages, // Store relative paths
      description,
      pickupLocation: { latitude: location.latitude, longitude: location.longitude },
      city,
      state,
      expiryDate: expiry,
    });

    res.status(201).json({ message: "Food request created successfully", foodRequest });
  } catch (error) {
    console.error("Error in createFoodRequest:", error);
    res.status(500).json({ message: "Server error", error });
  }
};


export const getFooddetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, city } = req.query; // Change from req.params to req.query

    if (!userId || !city) {
      res.status(400).json({ message: "User ID and city are required." });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.city !== city) {
      res.status(403).json({ message: "Unauthorized access to food details for this city." });
      return;
    }

    const foodRequests = await FoodRequestModel.find({ city: user.city });

    res.status(200).json({
      success: true,
      message: "Food requests fetched successfully",
      data: foodRequests,
    });
  } catch (error) {
    console.error("❌ Error fetching food details:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};