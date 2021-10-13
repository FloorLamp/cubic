import { Principal } from "@dfinity/principal";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { ledger, minter } from "../../api/agent";
import logger from "../../api/logger";
import { runMiddleware } from "../../api/middleware";
import { ICPTs } from "../../declarations/ledger/ledger.did";
import { canisterId as minterCanisterId } from "../../declarations/Minter";
import {
  accountIdentifierFromSubaccount,
  makeCanisterIdSubaccount,
} from "../../lib/accounts";
import { cyclesMintingCanisterId } from "../../lib/canisters";
import { FEE_AMOUNT } from "../../lib/constants";
import { accountForRecipient } from "../../lib/minter";
import { stringify } from "../../lib/utils";

const cors = Cors({
  methods: ["GET", "POST"],
});

// Mint cycles to our minter canister
const minterSubaccount = makeCanisterIdSubaccount(minterCanisterId);
const minterAccount = accountIdentifierFromSubaccount(
  Buffer.from(Principal.fromText(cyclesMintingCanisterId).toUint8Array()),
  Buffer.from(minterSubaccount)
);
logger.info(`minterAccount=${minterAccount}`);
console.log(minterSubaccount.toString());

const fee = { e8s: FEE_AMOUNT };

export default async function mintRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  const { body } = req;

  // Validation
  if (!body || !body.token || !body.recipient) {
    return res
      .status(400)
      .json({ error: "Please specify token and recipient" });
  }

  if (body.token !== "WTC" && body.token !== "XTC") {
    return res
      .status(400)
      .json({ error: "Invalid token, please specify WTC or XTC" });
  }
  let recipient: Principal;
  try {
    recipient = Principal.fromText(body.recipient);
  } catch (error) {
    return res.status(400).json({ error: "Invalid principal" });
  }

  // Ensure we don't have an active request
  if (await minter.isActive()) {
    return res
      .status(400)
      .json({ error: "Minter is in use, please try again soon" });
  }

  // User-specific account to deposit ICP to
  const { subaccount, accountId } = accountForRecipient(recipient);

  // Ensure balance is greater than tx fee
  let balance: ICPTs;
  try {
    balance = await ledger.account_balance_dfx({ account: accountId });
  } catch (error) {
    logger.warn(error.message);
    res.status(500).json({ error: "Failed to fetch balance" });
    return;
  }
  logger.info(`accountId=${accountId}, balance=${balance.e8s}`);

  // We need to make 2 transfers: 1 to cycles minter, 1 to notify
  const amountMinusFee = balance.e8s - BigInt(2) * FEE_AMOUNT;
  if (amountMinusFee <= BigInt(0)) {
    res.status(400).json({
      error: `Insufficient balance for transfer (${balance.e8s} e8s)`,
    });
    return;
  }

  // Send to cycles minter
  let blockHeight: bigint;
  try {
    blockHeight = await ledger.send_dfx({
      to: minterAccount,
      amount: { e8s: amountMinusFee },
      fee,
      memo: BigInt("1347768404"), // TPUP
      from_subaccount: [subaccount],
      created_at_time: [],
    });
  } catch (error) {
    logger.warn(error.message);
    res.status(500).json({ error: "Failed to send ICP" });
    return;
  }
  logger.info(
    `sent ICP to=${minterAccount}, amount=${amountMinusFee}, blockHeight=${blockHeight}`
  );

  // Print minterAccount balance
  try {
    const minterAccountBalance = await ledger.account_balance_dfx({
      account: minterAccount,
    });
    logger.info(`minterAccountBalance=${minterAccountBalance.e8s}`);
  } catch (error) {}

  // Open a request to our minter
  await minter.open({
    token: body.token === "WTC" ? { wtc: null } : { xtc: null },
    recipient,
  });
  logger.info(`minter request opened`);

  // Notify cycles minter
  try {
    await ledger.notify_dfx({
      block_height: blockHeight,
      max_fee: fee,
      from_subaccount: [subaccount],
      to_canister: Principal.fromText(cyclesMintingCanisterId),
      to_subaccount: [minterSubaccount],
    });
  } catch (error) {
    logger.warn(error.message);
    res.status(500).json({ error: "Failed to notify cycles minter" });
    const closed = await minter.close();
    logger.info(`minter request closed: ${closed}`);
    return;
  }

  const closed = await minter.close();
  if ("Ok" in closed) {
    logger.info(`success: ${stringify(closed.Ok)}`);
    res.json(stringify(closed));
  } else {
    logger.info(`failure: ${stringify(closed)}`);
    res.status(500).json(stringify(closed));
  }
}
