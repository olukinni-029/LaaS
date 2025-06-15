import mongoose from 'mongoose';

export enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  LENDER = 'lender',
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: Role;
  refreshToken?: string;
}

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum:Object.values(Role),default: Role.CUSTOMER},
  refreshToken: { type: String }
}, { timestamps: true });

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;
