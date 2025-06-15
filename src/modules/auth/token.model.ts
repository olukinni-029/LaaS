import mongoose from 'mongoose';

export interface ISession {
  userId: string;
  token: string;
  identifier: string;
}

const sessionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    token: { type: String, required: true },
    identifier: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const SessionModel = mongoose.model<ISession>('Session', sessionSchema);

export default SessionModel;
