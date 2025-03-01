import multer from "multer";
import path from "path";
import crypto from "crypto";

// Function to sanitize filenames
const sanitizeFilename = (filename: string) => {
  return filename.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_.-]/g, ""); // Remove spaces & special characters
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in the uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + crypto.randomBytes(6).toString("hex");
    const sanitizedFilename = sanitizeFilename(file.originalname);
    cb(null, `${uniqueSuffix}-${sanitizedFilename}`);
  },
});

export const upload = multer({ storage });