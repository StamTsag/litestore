import { Request, Response } from "express";
import { getIdentifierReq, sendError, sendSuccess } from "../utils";
import { prismaClient } from "../vars";
import { StringSchema } from "@ezier/validate";
import { identifierSchema } from "../schemas";

export async function fetchMe(req: Request, res: Response) {
  return sendSuccess(res, { identifier: getIdentifierReq(req) }, true);
}

export async function fetchProfile(req: Request, res: Response) {
  const userId = req.params.userId;

  // Validate params
  const schemaResult = new StringSchema({ ...identifierSchema }).validate({
    identifier: userId,
  });

  if (schemaResult.length != 0) {
    return sendError(400, res, schemaResult, true);
  }

  const accountObj = await prismaClient.account.findFirst({
    where: {
      identifier: userId,
    },

    select: {
      identifier: true,
      username: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!accountObj) {
    return sendError(404, res, "Account not found");
  }

  return sendSuccess(
    res,
    {
      profileData: accountObj,
    },
    true
  );
}
