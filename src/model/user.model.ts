import { DocumentType, Index, Severity, getModelForClass, index, modelOptions, pre, prop } from "@typegoose/typegoose";
import argon2 from "argon2";
import log from "../utils/logger";
import nanoid from "nanoid";

export const privateFields = ["password", "verificationCode", "passwordReset", "verified", "__v"];
@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await argon2.hash(this.password);

  this.password = hash;

  return;
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@Index({ email: 1 })
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      log.error(error, "could not validate password");
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
