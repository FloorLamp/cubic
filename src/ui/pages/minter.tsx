import { Principal } from "@dfinity/principal";
import classNames from "classnames";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { UseQueryResult } from "react-query";
import Select from "react-select";
import SpinnerButton from "../components/Buttons/SpinnerButton";
import Panel from "../components/Containers/Panel";
import ErrorAlert from "../components/Labels/ErrorAlert";
import { MetaTags } from "../components/MetaTags";
import { useGlobalContext, useLoginModal } from "../components/Store/Store";
import { FEE_AMOUNT } from "../lib/constants";
import { useCyclesPerIcp } from "../lib/hooks/useCyclesPerIcp";
import { useIcpBalance } from "../lib/hooks/useIcpBalance";
import useIcpTransfer from "../lib/hooks/useIcpTransfer";
import useMint from "../lib/hooks/useMint";
import { useMinterIsAvailable } from "../lib/hooks/useMinter";
import { useMinterIcpBalance } from "../lib/hooks/useMinterIcpBalance";
import { useWtcBalance } from "../lib/hooks/useWtcBalance";
import { useXtcBalance } from "../lib/hooks/useXtcBalance";
import { accountForRecipient } from "../lib/minter";
import { Asset, WrappedTcAsset } from "../lib/types";
import { formatNumber } from "../lib/utils";

if (!process.env.NEXT_PUBLIC_MINTER_PRINCIPAL) {
  throw "NEXT_PUBLIC_MINTER_PRINCIPAL not set!";
}

const ICP_MINIMUM = Number(FEE_AMOUNT * BigInt(3)) / 1e8;

type Side = "from" | "to";
const Assets: { value: Asset; label: ReactNode }[] = [
  {
    value: "XTC",
    label: <img className="w-4" src="/img/XTC.svg" />,
  },
  { value: "WTC", label: null },
  {
    value: "ICP",
    label: <img className="w-4" src="/img/dfinity.png" />,
  },
];
const formatOptionLabel = ({ value, label }) => {
  return (
    <span className="flex items-center gap-1 leading-none">
      <span className="w-5 inline-flex justify-center">{label || "🤔"}</span>
      <span>{value}</span>
    </span>
  );
};

const setterWithValidation =
  (setter: (arg: string) => void) => (value: string) =>
    /^[0-9.]*$/.test(value) && setter(value);

const AssetForm = ({
  asset,
  setAsset,
  value,
  onChangeValue,
  balanceQuery,
  canSetMax,
}: {
  asset: Asset;
  setAsset?: (arg: WrappedTcAsset) => void;
  value: string;
  onChangeValue: (arg: string) => void;
  balanceQuery: UseQueryResult<number>;
  canSetMax?: boolean;
}) => {
  const {
    state: { isAuthed },
  } = useGlobalContext();
  const balance = balanceQuery?.isSuccess ? Number(balanceQuery.data) : 0;

  return (
    <div>
      <div className="flex justify-between items-center text-gray-500 text-sm">
        <label>Balance</label>
        <div
          className={classNames("flex items-center gap-1", {
            "cursor-pointer hover:underline flex items-center gap-1":
              canSetMax && isAuthed,
          })}
          onClick={() => canSetMax && onChangeValue(balance.toString())}
        >
          {!isAuthed || !balanceQuery ? (
            "—"
          ) : balanceQuery.isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : balanceQuery.isSuccess ? (
            formatNumber(balanceQuery.data, 12)
          ) : (
            "—"
          )}
          <span>{asset}</span>
        </div>
      </div>
      <div className="mt-0.5 flex gap-1 items-center">
        {asset === "ICP" ? (
          <div className="absolute p-3 pointer-events-none">
            {formatOptionLabel(Assets.find(({ value }) => value === asset))}
          </div>
        ) : (
          <Select
            inputId="react-select-input"
            className="w-32 flex-none"
            formatOptionLabel={formatOptionLabel}
            onChange={({ value }) => setAsset(value as WrappedTcAsset)}
            options={Assets.filter(({ value }) => value !== "ICP")}
            defaultValue={Assets.find(({ value }) => value === asset)}
          />
        )}
        <input
          type="text"
          name="asset-amount"
          className={classNames("py-1.5 text-right flex-1 w-full", {})}
          placeholder="Amount"
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          min={0}
          maxLength={20}
          max={balance}
        />
      </div>
    </div>
  );
};

export default function Minter() {
  const {
    state: { isAuthed, principal },
  } = useGlobalContext();
  const icpBalance = useIcpBalance();
  const xtcBalance = useXtcBalance();
  const wtcBalance = useWtcBalance();
  const cyclesPerIcp = useCyclesPerIcp();
  const { data: minterIsAvailable } = useMinterIsAvailable();

  const [cycleToken, setCycleToken] = useState<WrappedTcAsset>(
    Assets[0].value as WrappedTcAsset
  );
  const [icpInput, setIcpInput] = useState("");
  const [cycleInput, setCycleInput] = useState("");
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    if (principal && !recipient) {
      setRecipient(principal.toText());
    }
  }, [principal]);

  const [error, setError] = useState("");
  const mutation = useMint({ token: cycleToken, recipient });

  const cycleBalance = cycleToken === "XTC" ? xtcBalance : wtcBalance;

  const max = icpBalance?.isSuccess ? Number(icpBalance.data) : 0;
  const icpAmount = Number(icpInput);
  const isInsufficient = !isNaN(icpAmount) && icpAmount > max;

  const inputRef = useRef<Side>(null);
  const setterWithRef =
    (setter: (arg: string) => void, ref: Side) => (arg: string) => {
      inputRef.current = ref;
      setter(arg);
    };
  useEffect(() => {
    if (icpInput) {
      const icpAmount = Number(icpInput);
      if (
        cyclesPerIcp.data &&
        inputRef.current === "from" &&
        !isNaN(icpAmount)
      ) {
        setCycleInput((icpAmount * cyclesPerIcp.data).toString());
      }
    } else {
      setCycleInput("");
    }
  }, [icpInput]);

  useEffect(() => {
    if (cycleInput) {
      const cycleAmount = Number(cycleInput);
      if (
        cyclesPerIcp.data &&
        inputRef.current === "to" &&
        !isNaN(cycleAmount)
      ) {
        setIcpInput((cycleAmount / cyclesPerIcp.data).toString());
      }
    } else {
      setIcpInput("");
    }
  }, [cycleInput]);

  const { data: pendingIcp } = useMinterIcpBalance(recipient);
  useEffect(() => {
    if (pendingIcp > ICP_MINIMUM && minterIsAvailable && !mutation.isLoading) {
      console.log("found pending balance, attempting mint...");

      mutation.mutate();
    }
  }, [pendingIcp, minterIsAvailable]);

  const transfer = useIcpTransfer();

  const [_, setIsOpen] = useLoginModal();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthed) {
      setIsOpen(true);
      return;
    }

    if (isNaN(icpAmount)) {
      setError("Invalid value");
      return;
    }
    if (icpAmount <= 0 || !recipient) {
      return;
    }
    const amount = BigInt(Math.round(icpAmount * 1e8));
    if (amount <= FEE_AMOUNT * BigInt(3)) {
      setError(`Amount must be greater than ${ICP_MINIMUM} ICP`);
      return;
    }

    let recipientPrincipal: Principal;
    try {
      recipientPrincipal = Principal.fromText(recipient);
    } catch (error) {
      setError("Invalid recipient");
      return;
    }
    const { accountId } = accountForRecipient(recipientPrincipal);
    console.log(`transfer ICP amount=${amount}, account=${accountId}`);

    try {
      const blockHeight = await transfer.mutateAsync({
        amount,
        toAccount: accountId,
      });
      console.log(`deposit success: block height ${blockHeight}`);
    } catch (error) {
      console.warn(`deposit failed: ${error.message}`);
      return;
    }
  };

  return (
    <div className="flex justify-center my-16">
      <MetaTags
        title="Cycles Minter"
        suffix={false}
        description="Mint wrapped cycles from ICP"
      />
      <Panel className="max-w-xs w-full p-4">
        <h1 className="text-xl">Cycles Minter</h1>
        <p className="text-sm mt-4">Use ICP to mint wrapped cycles.</p>
        <p className="text-sm mt-1">
          This is a <em>one way</em> operation.
        </p>
        <p className="text-sm mt-1">
          Cycles can be used to pay for applications, or kept as stablecoins.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4"
          autoComplete="off"
          autoCorrect="off"
        >
          <AssetForm
            asset="ICP"
            balanceQuery={icpBalance}
            value={icpInput}
            onChangeValue={setterWithRef(
              setterWithValidation(setIcpInput),
              "from"
            )}
            canSetMax={true}
          />

          <div className="w-full flex justify-center">
            <div className="rounded-full border-gray-500 border w-10 h-10 flex justify-center items-center">
              <BsArrowDown className="text-xl text-gray-500" />
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-sm">Recipient</label>
            <input
              type="text"
              name="cycles-recipient"
              className={classNames("py-1.5 text-right flex-1 w-full", {})}
              placeholder="Recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              maxLength={64}
              required={isAuthed}
              data-lpignore="true"
            />
          </div>

          <AssetForm
            asset={cycleToken}
            balanceQuery={cycleBalance}
            setAsset={setCycleToken}
            value={cycleInput}
            onChangeValue={setterWithRef(
              setterWithValidation(setCycleInput),
              "to"
            )}
          />

          <div className="text-xs text-gray-500 text-right">
            1 ICP ≈ {cyclesPerIcp.data || "—"} Trillion Cycles
          </div>

          {error && <ErrorAlert>{error}</ErrorAlert>}

          {pendingIcp > 0 && (
            <div className="border border-gray-300 rounded-sm px-2 py-1 flex justify-between text-sm">
              <label className="text-gray-500">Pending Mint</label>
              <div
                className={classNames({
                  "text-gray-300": pendingIcp <= ICP_MINIMUM,
                })}
              >
                {pendingIcp} ICP
              </div>
            </div>
          )}

          <SpinnerButton
            className="p-3 w-full"
            activeClassName="btn-cta cursor-pointer"
            disabledClassName="btn-cta-disabled"
            isLoading={transfer.isLoading || mutation.isLoading}
            isDisabled={
              isAuthed &&
              (!icpInput || isInsufficient || !recipient || !minterIsAvailable)
            }
          >
            {isAuthed
              ? isInsufficient
                ? `Insufficient balance`
                : !minterIsAvailable
                ? "Please wait..."
                : `Swap for ${cycleToken}`
              : "Login to Mint Cycles"}
          </SpinnerButton>

          {(transfer.error || mutation.error) && (
            <ErrorAlert>
              <pre className="w-full whitespace-pre-wrap text-xs break-all">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : mutation.error}
              </pre>
              <pre className="w-full whitespace-pre-wrap text-xs break-all">
                {transfer.error instanceof Error
                  ? transfer.error.message
                  : transfer.error}
              </pre>
            </ErrorAlert>
          )}
        </form>
      </Panel>
    </div>
  );
}
