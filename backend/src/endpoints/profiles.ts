import { Request, Response } from "express";
import { getIdentifierReq, sendSuccess } from "../utils";
import { prismaClient } from "../vars";

export async function fetchMe(req: Request, res: Response) {
  const accountObj = await prismaClient.account.findFirst({
    where: {
      identifier: getIdentifierReq(req),
    },

    select: {
      identifier: true,
      username: true,
      avatar: true,
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
