import mongoose from 'mongoose';
import { userStatus } from '../helpers/userStatus';

export const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true, lowercase: true },
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
