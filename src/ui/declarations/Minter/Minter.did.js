export const idlFactory = ({ IDL }) => {
  const TransactionId = IDL.Nat64;
  const MintError = IDL.Variant({ 'NotSufficientLiquidity' : IDL.Null });
  const Response = IDL.Variant({
    'Ok' : IDL.Record({
      'xtcTransactionId' : IDL.Opt(TransactionId),
      'amount' : IDL.Nat,
    }),
    'Err' : MintError,
    'NoCyclesReceived' : IDL.Null,
    'NoRecipient' : IDL.Null,
  });
  const Request = IDL.Record({
    'token' : IDL.Variant({ 'wtc' : IDL.Null, 'xtc' : IDL.Null }),
    'recipient' : IDL.Principal,
  });
  const Minter = IDL.Service({
    'close' : IDL.Func([], [Response], []),
    'isActive' : IDL.Func([], [IDL.Bool], ['query']),
    'open' : IDL.Func([Request], [IDL.Bool], []),
  });
  return Minter;
};
export const init = ({ IDL }) => {
  return [
    IDL.Record({
      'wtc' : IDL.Principal,
      'xtc' : IDL.Principal,
      'controller' : IDL.Principal,
    }),
  ];
};
