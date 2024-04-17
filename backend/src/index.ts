import { Account } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      userObj: Account;
    }
  }
}
