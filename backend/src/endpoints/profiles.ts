import { Request, Response } from "express";
import { sendSuccess } from "../utils";
import { prismaClient } from "../vars";

export async function fetchMe(req: Request, res: Response) {
  const accountObj = await prismaClient.account.findFirst({
    where: {
      identifier: req.userId,
    },

    select: {
      identifier: true,
      createdAt: true,
    },
  });

  return sendSuccess(
    res,
    {
      profileData: accountObj,
    },
    true
  );
}
