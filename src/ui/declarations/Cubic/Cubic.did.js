export const idlFactory = ({ IDL }) => {
  const Canisters = IDL.Record({
    'wtc' : IDL.Principal,
    'xtc' : IDL.Principal,
  });
  const Initialization = IDL.Record({
    'controller' : IDL.Principal,
    'canisters' : Canisters,
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
  const ProjectDetails = IDL.Record({
    'creator' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'createdTime' : IDL.Int,
  });
  const Block = IDL.Record({
    'id' : IDL.Nat,
    'totalSaleCount' : IDL.Nat,
    'totalValue' : IDL.Nat,
    'owner' : IDL.Principal,
    'lastPurchasePrice' : IDL.Int,
    'lastSaleTime' : IDL.Int,
    'lastSalePrice' : IDL.Int,
    'totalOwnedTime' : IDL.Int,
  });
  const Status = IDL.Record({
    'offerTimestamp' : IDL.Int,
    'owner' : IDL.Principal,
    'offerValue' : IDL.Nat,
  });
  const StatusAndOwner = IDL.Record({
    'status' : Status,
    'owner' : IDL.Opt(Block),
  });
  const BlocksRequest = IDL.Record({
    'order' : IDL.Variant({ 'asc' : IDL.Null, 'desc' : IDL.Null }),
    'orderBy' : IDL.Variant({
      'id' : IDL.Null,
      'totalSaleCount' : IDL.Null,
      'totalValue' : IDL.Null,
      'lastPurchasePrice' : IDL.Null,
      'lastSaleTime' : IDL.Null,
      'lastSalePrice' : IDL.Null,
      'totalOwnedTime' : IDL.Null,
    }),
    'projectId' : IDL.Nat,
  });
  const HistoryRequest = IDL.Record({
    'principal' : IDL.Opt(IDL.Principal),
    'projectId' : IDL.Nat,
  });
  const Transfer = IDL.Record({
    'id' : IDL.Nat,
    'to' : IDL.Principal,
    'value' : IDL.Nat,
    'from' : IDL.Principal,
    'timestamp' : IDL.Int,
  });
  const HistoryResponse = IDL.Record({
    'transfers' : IDL.Vec(Transfer),
    'count' : IDL.Nat,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackHttpResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : IDL.Func(
          [StreamingCallbackToken],
          [StreamingCallbackHttpResponse],
          ['query'],
        ),
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
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
      'cyclesBalance' : IDL.Nat,
      'taxCollected' : IDL.Nat,
    }),
    'canisters' : Canisters,
    'projectCount' : IDL.Nat,
  });
  const SetDetailsRequest = IDL.Record({
    'creator' : IDL.Opt(IDL.Text),
    'name' : IDL.Opt(IDL.Text),
    'description' : IDL.Opt(IDL.Text),
    'createdTime' : IDL.Opt(IDL.Int),
    'projectId' : IDL.Nat,
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
    'balance' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Nat], ['query']),
    'buy' : IDL.Func(
        [IDL.Record({ 'newOffer' : IDL.Nat, 'projectId' : IDL.Nat })],
        [Result],
        [],
      ),
    'canister_heartbeat' : IDL.Func([], [], []),
    'depositXtc' : IDL.Func([IDL.Principal], [IDL.Nat], []),
    'details' : IDL.Func(
        [IDL.Nat],
        [ProjectDetails, IDL.Vec(Block)],
        ['query'],
      ),
    'getAllStatus' : IDL.Func([], [IDL.Vec(StatusAndOwner)], ['query']),
    'getBlocks' : IDL.Func([BlocksRequest], [IDL.Vec(Block)], ['query']),
    'getHistory' : IDL.Func([HistoryRequest], [HistoryResponse], ['query']),
    'getStatus' : IDL.Func([IDL.Nat], [StatusAndOwner], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'info' : IDL.Func([], [Info], ['query']),
    'newProject' : IDL.Func([ProjectDetails], [], []),
    'restore' : IDL.Func([], [], []),
    'setCanisters' : IDL.Func([Canisters], [], []),
    'setDetails' : IDL.Func([SetDetailsRequest], [], []),
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
  });
  return [Initialization];
};
