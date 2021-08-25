import { Principal } from "@dfinity/principal";
import Cors from "cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { ledger, minter, principal } from "../../api/agent";
import logger from "../../api/logger";
import { runMiddleware } from "../../api/middleware";
import { ICPTs } from "../../declarations/ledger/ledger.did";
import { canisterId as minterCanisterId } from "../../declarations/Minter";
import { accountIdentifierFromSubaccount } from "../../lib/accounts";
import { cyclesMintingCanisterId } from "../../lib/canisters";

const cors = Cors({
  methods: ["GET", "POST"],
});

const padSubaccountArray = (arg: Array<number>) =>
  [arg.length].concat(
    arg.concat(Array.from({ length: 32 - arg.length - 1 }, () => 0))
  );

// Mint cycles to our minter canister
const minterSubaccount = padSubaccountArray(
  Array.from(Principal.fromText(minterCanisterId).toUint8Array())
);
const minterAccount = accountIdentifierFromSubaccount(
  Buffer.from(Principal.fromText(cyclesMintingCanisterId).toUint8Array()),
  Buffer.from(minterSubaccount)
);
logger.info(`minterAccount=${minterAccount}`);
console.log(minterSubaccount.toString());

const FEE_AMOUNT = BigInt(10_000);
const fee = { e8s: FEE_AMOUNT };

export default async function submitRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await runMiddleware(req, res, cors);
  const { body } = req;

  // Validation
  if (!body || !body.token || !body.principal || !body.subaccount) {
    return res
      .status(400)
      .json({ error: "Please specify token, principal, and subaccount" });
  }

  if (!/^[0-9a-fA-F]{64}$/.test(body.subaccount)) {
    return res.status(400).json({ error: "Invalid subaccount" });
  }
  if (body.token !== "WTC" && body.token !== "XTC") {
    return res
      .status(400)
      .json({ error: "Invalid token, please specify WTC or XTC" });
  }
  let recipient: Principal;
  try {
    recipient = Principal.fromText(body.principal);
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
  const userSubaccount = Buffer.from(body.subaccount, "hex");
  const userAccount = accountIdentifierFromSubaccount(
    Buffer.from(principal.toUint8Array()),
    userSubaccount
  );

  // Ensure balance is greater than tx fee
  let balance: ICPTs;
  try {
    balance = await ledger.account_balance_dfx({ account: userAccount });
  } catch (error) {
    logger.warn(error.message);
    res.status(500).json({ error: "Failed to fetch balance" });
    return;
  }
  logger.info(`userAccount=${userAccount}, balance=${balance.e8s}`);

  if (balance.e8s <= BigInt(2) * FEE_AMOUNT) {
    res.status(400).json({
      error: `Insufficient balance for transfer (${balance.e8s} e8s)`,
    });
    return;
  }

  // Send to cycles minter
  const amountMinusFee = balance.e8s - BigInt(2) * FEE_AMOUNT;
  let blockHeight: bigint;
  try {
    blockHeight = await ledger.send_dfx({
      to: minterAccount,
      amount: { e8s: amountMinusFee },
      fee,
      memo: BigInt("1347768404"), // TPUP
      from_subaccount: [Array.from(userSubaccount)],
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
    principal: recipient,
  });
  logger.info(`minter request opened`);

  // Notify cycles minter
  try {
    await ledger.notify_dfx({
      block_height: blockHeight,
      max_fee: fee,
      from_subaccount: [Array.from(userSubaccount)],
      to_canister: Principal.fromText(cyclesMintingCanisterId),
      to_subaccount: [minterSubaccount],
    });
  } catch (error) {
    logger.warn(error.message);
    res.status(500).json({ error: "Failed to notify cycles minter" });
    await minter.close();
    logger.info(`minter request closed`);
    return;
  }

  if (await minter.close()) {
    logger.info("success");
    res.end();
  } else {
    logger.warn("failure");
    res.status(500).json({ error: "Failed to receive cycles from minter" });
  }

  /**
    dfx canister --no-wallet call 3ledger send_dfx "record {memo=1347768404:nat64;amount=record {e8s=100000000:nat64};fee=record {e8s=10000:nat64};from_subaccount=null;to=\"4f2f64bf009bb1f62e58c8979976a50b2974f0d7148b7010621e8f7aff000c1b\";created_at_time=null}"

    dfx canister --no-wallet call 3ledger notify_dfx "record {block_height=15:nat64;max_fee=record{e8s=10000:nat64};from_subaccount=null;to_canister=\"rkp4c-7iaaa-aaaaa-aaaca-cai\";to_subaccount=opt vec {0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;4;1;1}}"
   */
}
