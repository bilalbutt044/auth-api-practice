import { DocumentType } from "@typegoose/typegoose";
import { User, privateFields } from "../model/user.model";
import { signJwt } from "../utils/jwt";
import SessionModel from "../model/session.model";
import omit from "lodash/omit";
export async function createSession({ userId }: { userId: string }) {
  const session = SessionModel.create({ user: userId });
  return session;
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({ userId });
  const refreshToken = signJwt({ session: session._id }, "refreshTokenPrivateKey");
  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), privateFields);
  const accessToken = signJwt(payload, "accessTokenPrivateKey");

  return accessToken;
}
