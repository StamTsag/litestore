import { Request, Response } from "express";

export function keepAlive(_: Request, res: Response) {
  return res.status(200).send("Litestore");
}
