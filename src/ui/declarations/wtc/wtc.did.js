export const idlFactory = ({ IDL }) => {
  const TokenIdentifier = IDL.Text;
  const AccountIdentifier = IDL.Text;
  const User = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  const BalanceRequest = IDL.Record({
    'token' : TokenIdentifier,
    'user' : User,
  });
  const Balance = IDL.Nat;
  const CommonError__1 = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const BalanceResponse = IDL.Variant({
    'ok' : Balance,
    'err' : CommonError__1,
  });
  const AccountIdentifier__1 = IDL.Text;
  const Balance__1 = IDL.Nat;
  const Callback = IDL.Func([], [], []);
  const Extension = IDL.Text;
  const TokenIdentifier__1 = IDL.Text;
  const Metadata = IDL.Variant({
    'fungible' : IDL.Record({
      'decimals' : IDL.Nat8,
      'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)),
      'name' : IDL.Text,
      'symbol' : IDL.Text,
    }),
    'nonfungible' : IDL.Record({ 'metadata' : IDL.Opt(IDL.Vec(IDL.Nat8)) }),
  });
  const CommonError = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const Result_1 = IDL.Variant({ 'ok' : Metadata, 'err' : CommonError });
  const User__1 = IDL.Variant({
    'principal' : IDL.Principal,
    'address' : AccountIdentifier,
  });
  const Result = IDL.Variant({ 'ok' : Balance__1, 'err' : CommonError });
  const Memo = IDL.Vec(IDL.Nat8);
  const SubAccount = IDL.Vec(IDL.Nat8);
  const TransferRequest = IDL.Record({
    'to' : User,
    'fee' : Balance,
    'token' : TokenIdentifier,
    'notify' : IDL.Bool,
    'from' : User,
    'memo' : Memo,
    'subaccount' : IDL.Opt(SubAccount),
    'amount' : Balance,
  });
  const TransferResponse = IDL.Variant({
    'ok' : Balance,
    'err' : IDL.Variant({
      'CannotNotify' : AccountIdentifier,
      'InsufficientBalance' : IDL.Null,
      'InvalidToken' : TokenIdentifier,
      'Rejected' : IDL.Null,
      'Unauthorized' : AccountIdentifier,
      'Other' : IDL.Text,
    }),
  });
  return IDL.Service({
    'acceptCycles' : IDL.Func([], [], []),
    'actualCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'availableCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'balance' : IDL.Func([BalanceRequest], [BalanceResponse], ['query']),
    'balance_secure' : IDL.Func([BalanceRequest], [BalanceResponse], []),
    'balances' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(AccountIdentifier__1, Balance__1))],
        ['query'],
      ),
    'burn' : IDL.Func([Balance__1, Callback], [IDL.Bool], []),
    'extensions' : IDL.Func([], [IDL.Vec(Extension)], ['query']),
    'extensions_secure' : IDL.Func([], [IDL.Vec(Extension)], []),
    'fee' : IDL.Func([], [Balance__1], ['query']),
    'metadata' : IDL.Func([TokenIdentifier__1], [Result_1], ['query']),
    'metadata_secure' : IDL.Func([TokenIdentifier__1], [Result_1], []),
    'minCyclesThreshold' : IDL.Func([], [Balance__1], ['query']),
    'mint' : IDL.Func([IDL.Opt(User__1)], [], []),
    'supply' : IDL.Func([TokenIdentifier__1], [Result], ['query']),
    'supply_secure' : IDL.Func([TokenIdentifier__1], [Result], []),
    'transfer' : IDL.Func([TransferRequest], [TransferResponse], []),
  });
};
export const init = ({ IDL }) => { return []; };
