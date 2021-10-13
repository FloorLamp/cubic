import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { minter } from "../../api/agent";
import logger from "../../api/logger";
import { runMiddleware } from "../../api/middleware";
import { stringify } from "../../lib/utils";

const cors = Cors({
  methods: ["POST"],
});

export default async function close(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors);

  const closed = await minter.close();

  if ("Ok" in closed) {
    logger.info(`success: ${stringify(closed.Ok)}`);
    res.json(stringify(closed));
  } else {
    logger.info(`failure: ${stringify(closed)}`);
    res.status(500).json(stringify(closed));
  }
}
