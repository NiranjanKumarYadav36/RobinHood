import mongoose, { Schema, Document } from "mongoose";

// Enums for user roles
enum UserRole {
  SPONSOR = "sponsor",
  VOLUNTEER = "volunteer",
  VOLUNTEER_T2 = "volunteer_t2",
  DC_ADMIN = "dc_admin"
};

// User Schema
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
  state: string;
  city: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isAvailable?: boolean; // Only applicable for normal volunteers
};

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: Object.values(UserRole), required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  location: {
    latitude: { type: Number, required: false, default: 19.0760 }, // Mumbai Latitude
    longitude: { type: Number, required: false, default: 72.8777 } // Mumbai Longitude
  },
  isAvailable: { type: Boolean, default: true }
});


// Apply `isAvailable` only to "volunteer" role
UserSchema.pre("save", function (next) {
  if (this.role !== UserRole.VOLUNTEER) {
    this.isAvailable = undefined;
  }
  next();
});

const UserModel = mongoose.model<IUser>("User", UserSchema);

// Food Request Schema (Created by Sponsor)
interface IFoodRequest extends Document {
  sponsor: mongoose.Types.ObjectId;
  foodName: string;
  images: string[];
  pickupLocation: string;
  description?: string;
  status: "pending" | "assigned" | "picked" | "delivered";
  assignedVolunteer?: mongoose.Types.ObjectId;
  createdAt: Date;
  expiryDate: Date;
  city: string;
  state: string;
}

const FoodRequestSchema = new Schema<IFoodRequest>(
  {
    sponsor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    foodName: { type: String, required: true },
    images: [{ type: String, required: true }],
    pickupLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    }, // Updated location field
    city: { type: String, required: true }, // City of the request
    state: { type: String, required: true }, // State of the request
    expiryDate: { type: Date, required: false }, // Optional expiry date
    status: { type: String, enum: ["pending", "assigned", "picked", "delivered"], default: "pending" },
    assignedVolunteer: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const FoodRequestModel = mongoose.model<IFoodRequest>("FoodRequest", FoodRequestSchema);

// Distribution Center Schema
interface IDistributionCenter extends Document {
  name: string;
  state: string;
  city: string;
  admin: mongoose.Types.ObjectId;
  location: {
    latitude: number;
    longitude: number;
  };
}

const DistributionCenterSchema = new Schema<IDistributionCenter>({
  name: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
});

const DistributionCenterModel = mongoose.model<IDistributionCenter>("DistributionCenter", DistributionCenterSchema);

// Food Details Schema (Stored in Distribution Centers)
interface IFoodDetails extends Document {
  foodRequest: mongoose.Types.ObjectId;
  distributionCenter: mongoose.Types.ObjectId;
  expiryDate: Date;
  calories: number;
  nutrientValues: string;
  quantity: number;
}

const FoodDetailsSchema = new Schema<IFoodDetails>({
  foodRequest: { type: Schema.Types.ObjectId, ref: "FoodRequest", required: true },
  distributionCenter: { type: Schema.Types.ObjectId, ref: "DistributionCenter", required: true },
  expiryDate: { type: Date, required: true },
  calories: { type: Number, required: true },
  nutrientValues: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const FoodDetailsModel = mongoose.model<IFoodDetails>("FoodDetails", FoodDetailsSchema);

// Regions Schema (Hierarchy for State -> City)
interface IRegion extends Document {
  state: string;
  city: string;
}

const RegionSchema = new Schema<IRegion>({
  state: { type: String, required: true },
  city: { type: String, required: true }
});

const RegionModel = mongoose.model<IRegion>("Region", RegionSchema);

export {
  UserModel,
  FoodRequestModel,
  DistributionCenterModel,
  FoodDetailsModel,
  RegionModel,
  UserRole
};
