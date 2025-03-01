import express from "express";
import {DistributionCenterModel} from "../models/Food.model"; // Import the model

const router = express.Router();

// Create Distribution Center (No authentication required)
router.post("/create", async (req, res) => {
    try {
        const { name, state, city, admin } = req.body;

        if (!name || !state || !city || !admin) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const newDC = new DistributionCenterModel({ name, state, city, admin });
        await newDC.save();

        res.status(201).json({ success: true, message: "Distribution Center created successfully!", data: newDC });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

export default router;
