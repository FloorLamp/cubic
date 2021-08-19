const CUBIC_CANISTER_ID =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? require("../../.dfx/local/canister_ids.json").Cubic.local
    : process.env.NEXT_PUBLIC_DFX_NETWORK === "staging"
    ? require("../../canister_ids.json").staging.ic
    : require("../../canister_ids.json").Cubic.ic;
console.log(`NEXT_PUBLIC_DFX_NETWORK=${process.env.NEXT_PUBLIC_DFX_NETWORK}`);
console.log(`CUBIC_CANISTER_ID=${CUBIC_CANISTER_ID}`);

const XTC_CANISTER_ID =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "xifbj-tqaaa-aaaaa-aaauq-cai"
    : "aanaa-xaaaa-aaaah-aaeiq-cai";
console.log(`XTC_CANISTER_ID=${XTC_CANISTER_ID}`);

const WTC_CANISTER_ID =
  process.env.NEXT_PUBLIC_DFX_NETWORK === "local"
    ? "xub3y-eqaaa-aaaaa-aaawq-cai"
    : "5ymop-yyaaa-aaaah-qaa4q-cai";
console.log(`WTC_CANISTER_ID=${WTC_CANISTER_ID}`);

module.exports = {
  env: {
    CUBIC_CANISTER_ID,
    XTC_CANISTER_ID,
    WTC_CANISTER_ID,
  },
};
