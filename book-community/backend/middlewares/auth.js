import { throwError } from "../util/error.js";
import jwt from "jsonwebtoken";

export function isAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throwError("Not authenticated", 401);
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.status = 500;
    throw error;
  }
  if (!decodedToken) {
    throwError("Not authenticated", 401);
  }

  req.userId = decodedToken.userId;

  next();
}
