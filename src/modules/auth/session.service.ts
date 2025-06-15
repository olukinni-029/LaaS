import SessionModel, { ISession } from "./token.model";

export class SessionService {
  public static async createSession(data: ISession) {
    return SessionModel.create(data);
  }

  public static async findOneSessionByToken(token: string) {
    return SessionModel.findOne({ token });
  }

  public static async deleteSessionByToken(token: string) {
    return SessionModel.deleteOne({ token });
  }
}
