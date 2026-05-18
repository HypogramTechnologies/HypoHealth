import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
export const EXPIRES_IN = "1d";

export interface TokenPayload {
  id: string;
  email: string;
}

export function generateToken(payload: TokenPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
