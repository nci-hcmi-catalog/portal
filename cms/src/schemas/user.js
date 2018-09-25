import mongoose from 'mongoose';

// Constants
export const userStatus = {
  active: 'Active',
  inactive: 'Inactive',
};

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    status: {
      type: String,
      enum: [userStatus.active, userStatus.inactive],
      default: userStatus.active,
    },
  },
  {
    timestamps: true,
    collection: process.env.MONGO_USER_COLLECTION || 'users',
  },
);

export default mongoose.model('User', UserSchema);
