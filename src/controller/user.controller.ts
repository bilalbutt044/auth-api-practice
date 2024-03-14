import { Request, Response } from "express";
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById } from "../service/user.service";
import sendEmail from "../utils/mailer";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
  const body = req.body;

  try {
    const user = await createUser(body);
    await sendEmail({
      from: "test@example.com",
      to: user.email,
      subject: "Please verify your account",
      text: `verification code ${user.verificationCode}. id: ${user._id}`,
    });
    return res.send("User successfully created");
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).send("ACcount already exists");
    }
    return res.status(500).send(error);
  }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  try {
    const user = await findUserById(id);

    if (!user) return res.send("could not verify user");

    // check to see if they are already verified
    if (user.verified) return res.send("User is already verified");

    // check to see if verification code matches
    if (user.verificationCode === verificationCode) {
      user.verified = true;

      await user.save();
      return res.send("User successfully verified");
    }

    return res.send("Could not verify user");
  } catch (error: any) {
    return res.status(400).send(error.message);
  }
}
