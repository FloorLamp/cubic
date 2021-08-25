console.log(`NEXT_PUBLIC_DFX_NETWORK=${process.env.NEXT_PUBLIC_DFX_NETWORK}`);

const MINTER_CANISTER_ID =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? require("../../.dfx/local/canister_ids.json").Minter.local
    : process.env.NEXT_PUBLIC_DFX_NETWORK === "staging"
    ? require("../../canister_ids.json").staging.ic
    : require("../../canister_ids.json").Minter.ic;
console.log(`MINTER_CANISTER_ID=${MINTER_CANISTER_ID}`);

const CUBIC_CANISTER_ID =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? require("../../.dfx/local/canister_ids.json").Cubic.local
    : process.env.NEXT_PUBLIC_DFX_NETWORK === "staging"
    ? require("../../canister_ids.json").staging.ic
    : require("../../canister_ids.json").Cubic.ic;
console.log(`CUBIC_CANISTER_ID=${CUBIC_CANISTER_ID}`);

const IDENTITY_CANISTER_ID =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "rdmx6-jaaaa-aaaaa-aaadq-cai"
    : undefined;
console.log(`IDENTITY_CANISTER_ID=${IDENTITY_CANISTER_ID}`);

const XTC_CANISTER_ID =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "tqtu6-byaaa-aaaaa-aaana-cai"
    : "aanaa-xaaaa-aaaah-aaeiq-cai";
console.log(`XTC_CANISTER_ID=${XTC_CANISTER_ID}`);

const WTC_CANISTER_ID =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "txssk-maaaa-aaaaa-aaanq-cai"
    : "5ymop-yyaaa-aaaah-qaa4q-cai";
console.log(`WTC_CANISTER_ID=${WTC_CANISTER_ID}`);

module.exports = {
  env: {
    MINTER_CANISTER_ID,
    CUBIC_CANISTER_ID,
    IDENTITY_CANISTER_ID,
    XTC_CANISTER_ID,
    WTC_CANISTER_ID,
  },
};
