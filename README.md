# cubic

Generative art platform on the Internet Computer.

- Data is based on canister state:
  - Transaction history
  - Ownership duration
- Auctions are based on Harberger taxes
- Payment uses wrapped cycles
- Users are required to deposit WTC/XTC into the platform, which is debited for taxes

## Artists and creative coders

Experiment with a new medium that is interactive and dynamic. Earn royalties based on sales. Message me on Twitter [@floatfloatboat](https://twitter.com/floatfloatboat) or Telegram [@nortonwang](https://t.me/nortonwang) to collaborate!

# Local Development

Cubic depends on WTC and XTC canisters. Please make sure those have been deployed first.

Clone and deploy [WTC](https://github.com/Toniq-Labs/wrapped_cycles):

```sh
git clone git@github.com:Toniq-Labs/wrapped_cycles.git
cd wrapped_cycles
dfx deploy
# save WTC canister
WTC_CANISTER_ID=$(cat .dfx/local/canister_ids.json | jq '.wtc.local')
```

Clone and deploy [XTC](https://github.com/Psychedelic/dank):

```sh
git clone git@github.com:Psychedelic/dank.git
cd dank
dfx deploy
# save XTC canister
XTC_CANISTER_ID=$(cat .dfx/local/canister_ids.json | jq '.xtc.local')
```

## Using WTC/XTC

You can issue WTC/XTC to yourself by repeatedly creating new cycles wallets:

**WTC**:

```sh
cd wrapped_cycles
rm .dfx/local/wallets.json; dfx canister --wallet=$(dfx identity get-wallet) call --with-cycles 100000000000000 $(dfx canister id wtc) mint "(opt variant { \"principal\" = principal \"$(dfx identity get-principal)\" })"
```

**XTC**:

```sh
cd dank
rm .dfx/local/wallets.json && dfx canister --wallet=$(dfx identity get-wallet) call --with-cycles 100000000000000 $(dfx canister id xtc) mint "(opt principal \"$(dfx identity get-principal)\")"
```

## End-to-end cycles minting with ICP

Deploying a ICP ledger canister locally will allow you to test end-to-end cycles minting. You'll want a fresh replica state, and ensure that the ledger is deployed to `ryjl3-tyaaa-aaaaa-aaaba-cai`.

## Deploy and Run Cubic

Only the `Cubic` and `Minter` canisters are required for basic functionality. `CubicBackup` and `heartbeat` can be deployed if needed.

```sh
cd cubic
dfx build

dfx deploy Minter --argument "(record {controller= principal \"$(dfx identity get-principal)\"; wtc= principal $(WTC_CANISTER_ID); xtc= principal $(XTC_CANISTER_ID)})"

dfx deploy Cubic --argument "(record {controller= principal \"$(dfx identity get-principal)\"; canisters= record {wtc= principal $(WTC_CANISTER_ID); xtc= principal $(XTC_CANISTER_ID)}})"

cd src/ui
DFX_NETWORK=local npm run copy:types
npm run dev
```
