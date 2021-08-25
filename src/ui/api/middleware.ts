import { NextApiRequest, NextApiResponse } from "next";

export const runMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (...args: any[]) => void
) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};
