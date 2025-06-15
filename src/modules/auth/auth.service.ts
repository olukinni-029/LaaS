import mongoose from "mongoose";
import UserModel, { IUser } from "./user.model";

export class UserService {
  public static async findOneByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  public static async createUser(userData: IUser) {
    return UserModel.create(userData);
  }

  public static async findOneById(id: string) {
    const convertToObjectId = new mongoose.Types.ObjectId(id);
    console.log("convertToObjectId: ", convertToObjectId);
    return UserModel.findById({ _id: convertToObjectId });
  }
}
