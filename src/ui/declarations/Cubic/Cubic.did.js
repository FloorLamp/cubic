export const idlFactory = ({ IDL }) => {
  const Canisters = IDL.Record({
    'wtc' : IDL.Principal,
    'xtc' : IDL.Principal,
  });
  const Initialization = IDL.Record({
    'controller' : IDL.Principal,
    'canisters' : Canisters,
    'defaultValue' : IDL.Nat,
  });
  const Block = IDL.Record({
    'id' : IDL.Nat,
    'totalValue' : IDL.Nat,
    'owner' : IDL.Principal,
    'totalOwnedTime' : IDL.Int,
  });
  const ErrorCode = IDL.Variant({
    'canister_error' : IDL.Null,
    'system_transient' : IDL.Null,
    'future' : IDL.Nat32,
    'canister_reject' : IDL.Null,
    'destination_invalid' : IDL.Null,
    'system_fatal' : IDL.Null,
  });
  const TransferError__1 = IDL.Variant({
    'CallFailed' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'Unknown' : IDL.Null,
    'AmountTooLarge' : IDL.Null,
  });
  const AccountIdentifier = IDL.Text;
  const TokenIdentifier = IDL.Text;
  const TransferError = IDL.Variant({
    'CannotNotify' : AccountIdentifier,
    'InsufficientBalance' : IDL.Null,
    'InvalidToken' : TokenIdentifier,
    'Rejected' : IDL.Null,
    'Unauthorized' : AccountIdentifier,
    'Other' : IDL.Text,
  });
  const Error = IDL.Variant({
    'Error' : IDL.Record({
      'error_message' : IDL.Text,
      'error_type' : ErrorCode,
    }),
    'InsufficientBalance' : IDL.Null,
    'XtcTransferError' : TransferError__1,
    'WtcTransferError' : TransferError,
    'InsufficientLiquidity' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const BlocksRequest = IDL.Record({
    'order' : IDL.Variant({ 'asc' : IDL.Null, 'desc' : IDL.Null }),
    'orderBy' : IDL.Variant({
      'id' : IDL.Null,
      'totalValue' : IDL.Null,
      'totalOwnedTime' : IDL.Null,
    }),
  });
  const Transfer = IDL.Record({
    'to' : IDL.Principal,
    'value' : IDL.Nat,
    'from' : IDL.Principal,
    'timestamp' : IDL.Int,
  });
  const Status = IDL.Record({
    'offerTimestamp' : IDL.Int,
    'owner' : IDL.Principal,
    'offerValue' : IDL.Nat,
  });
  const Info = IDL.Record({
    'stats' : IDL.Record({
      'foreclosureCount' : IDL.Nat,
      'transactionFee' : IDL.Nat,
      'wtcBalance' : IDL.Nat,
      'feesCollected' : IDL.Nat,
      'lastTaxTimestamp' : IDL.Int,
      'transactionsCount' : IDL.Nat,
      'salesTotal' : IDL.Nat,
      'cubesSupply' : IDL.Nat,
      'ownCubesBalance' : IDL.Nat,
      'annualTaxRate' : IDL.Nat,
      'xtcBalance' : IDL.Nat,
      'ownerCount' : IDL.Nat,
      'cyclesBalance' : IDL.Nat,
      'taxCollected' : IDL.Nat,
    }),
    'canisters' : Canisters,
  });
  const User = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  const Balance = IDL.Nat;
  const Memo = IDL.Vec(IDL.Nat8);
  const WithdrawRequest = IDL.Record({
    'asset' : IDL.Variant({ 'WTC' : IDL.Null, 'XTC' : IDL.Null }),
    'amount' : IDL.Nat,
  });
  const Cubic = IDL.Service({
    'acceptCycles' : IDL.Func([], [], []),
    'art' : IDL.Func([], [IDL.Vec(Block)], ['query']),
    'balance' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Nat], ['query']),
    'buy' : IDL.Func([IDL.Nat], [Result], []),
    'canister_heartbeat' : IDL.Func([], [], []),
    'depositXtc' : IDL.Func([IDL.Principal], [IDL.Nat], []),
    'getBlocks' : IDL.Func([BlocksRequest], [IDL.Vec(Block)], ['query']),
    'getHistory' : IDL.Func([], [IDL.Vec(Transfer)], ['query']),
    'getStatus' : IDL.Func([], [Status, IDL.Opt(Block)], ['query']),
    'info' : IDL.Func([], [Info], ['query']),
    'setCanisters' : IDL.Func([Canisters], [], []),
    'tokenTransferNotification' : IDL.Func(
        [TokenIdentifier, User, Balance, Memo],
        [IDL.Opt(Balance)],
        [],
      ),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
    'withdraw' : IDL.Func([WithdrawRequest], [Result], []),
  });
  return Cubic;
};
export const init = ({ IDL }) => {
  const Canisters = IDL.Record({
    'wtc' : IDL.Principal,
    'xtc' : IDL.Principal,
  });
  const Initialization = IDL.Record({
    'controller' : IDL.Principal,
    'canisters' : Canisters,
    'defaultValue' : IDL.Nat,
  });
  return [Initialization];
};
