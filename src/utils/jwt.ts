import jwt from "jsonwebtoken";
import fs from "fs";

interface KeyNames {
  accessTokenPrivateKey: string;
  accessTokenPublicKey: string;
  refreshTokenPublicKey: string;
  refreshTokenPrivateKey: string;
}

const fileNames: KeyNames = {
  accessTokenPrivateKey: "ACCESS_TOKEN_PRIVATE_KEY",
  accessTokenPublicKey: "ACCESS_TOKEN_PUBLIC_KEY",
  refreshTokenPublicKey: "REFRESH_PUBLIC_KEY",
  refreshTokenPrivateKey: "REFRESH_PRIVATE_KEY",
};

const getKeys = (keyName: keyof KeyNames): string => {
  // Type assertion for clarity (optional)
  const fileName = fileNames[keyName] as string;
  return fs.readFileSync(`${fileName}.key`, "utf-8");
};

export function signJwt(object: Object, keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey", options?: jwt.SignOptions | undefined) {
  const signinKey = fs.readFileSync(`${fileNames[keyName]}.key`, "utf-8");
  return jwt.sign(object, signinKey, {
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(token: string, keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"): T | null {
  const publicKey = getKeys(keyName);

  try {
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
}
