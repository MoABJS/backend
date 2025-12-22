import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, result: result.array() });
  }

  next();
};

export default validate;
