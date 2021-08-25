export const idlFactory = ({ IDL }) => {
  const Request = IDL.Record({
    'principal' : IDL.Principal,
    'token' : IDL.Variant({ 'wtc' : IDL.Null, 'xtc' : IDL.Null }),
  });
  const Minter = IDL.Service({
    'close' : IDL.Func([], [IDL.Bool], []),
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
