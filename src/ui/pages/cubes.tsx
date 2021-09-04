import classNames from "classnames";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { BsArrowDown } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import { UseQueryResult } from "react-query";
import Select from "react-select";
import IdentifierLabelWithButtons from "../components/Buttons/IdentifierLabelWithButtons";
import SpinnerButton from "../components/Buttons/SpinnerButton";
import Panel from "../components/Containers/Panel";
import ErrorAlert from "../components/Labels/ErrorAlert";
import { TokenLogo } from "../components/Labels/TokenLabel";
import { useGlobalContext, useLoginModal } from "../components/Store/Store";
import { canisterId } from "../declarations/Cubic";
import { useCubesBalance } from "../lib/hooks/useCubesBalance";
import useWithdraw from "../lib/hooks/useWithdraw";
import { useWtcBalance } from "../lib/hooks/useWtcBalance";
import useWtcDeposit from "../lib/hooks/useWtcDeposit";
import { useXtcBalance } from "../lib/hooks/useXtcBalance";
import useXtcDeposit from "../lib/hooks/useXtcDeposit";
import { Asset, TcAsset } from "../lib/types";
import { formatNumber } from "../lib/utils";

const Assets: { value: Asset; label: ReactNode }[] = [
  {
    value: "XTC",
    label: <img className="w-4" src="/img/XTC.svg" />,
  },
  { value: "WTC", label: null },
  { value: "Cycles", label: null },
  {
    value: "CUBE",
    label: <TokenLogo />,
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

type Side = "from" | "to";
const AssetForm = ({
  side,
  asset,
  setAsset,
  value,
  onChangeValue,
  balanceQuery,
  canSetMax,
}: {
  side: Side;
  asset: Asset;
  setAsset: (arg: Asset) => void;
  value: string;
  onChangeValue: (arg: string) => void;
  balanceQuery: UseQueryResult<number>;
  canSetMax?: boolean;
}) => {
  const {
    state: { isAuthed },
  } = useGlobalContext();
  const balance = balanceQuery.isSuccess ? Number(balanceQuery.data) : 0;

  return (
    <div>
      <div className="flex justify-between items-center text-gray-500 text-sm">
        <label>Balance</label>
        <div
          className={classNames("flex items-center gap-1", {
            "cursor-pointer hover:underline flex items-center gap-1": canSetMax,
          })}
          onClick={() => canSetMax && onChangeValue(balance.toString())}
        >
          {!isAuthed || asset === "Cycles" ? (
            "—"
          ) : balanceQuery?.isLoading ? (
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
        {asset === "CUBE" ? (
          <div className="absolute p-3 pointer-events-none">
            {formatOptionLabel(Assets.find(({ value }) => value === asset))}
          </div>
        ) : (
          <Select
            inputId="react-select-input"
            className="w-32 flex-none"
            formatOptionLabel={formatOptionLabel}
            onChange={({ value }) => setAsset(value as Asset)}
            options={Assets.filter(
              ({ value }) =>
                value !== "CUBE" && (side === "to" ? value !== "Cycles" : true)
            )}
            defaultValue={Assets.find(({ value }) => value === asset)}
          />
        )}
        <input
          type="text"
          name="cubes-amount"
          className={classNames("py-1.5 text-right flex-1 w-full", {
            "bg-gray-100 text-gray-200": asset === "Cycles",
          })}
          placeholder="Amount"
          value={value}
          onChange={(e) => onChangeValue(e.target.value)}
          min={0}
          maxLength={20}
          max={balance}
          disabled={asset === "Cycles"}
        />
      </div>
    </div>
  );
};

export default function Cubes() {
  const {
    state: { isAuthed },
  } = useGlobalContext();
  const cubesBalance = useCubesBalance();
  const xtcBalance = useXtcBalance();
  const wtcBalance = useWtcBalance();

  const [fromAsset, setFromAsset] = useState<Asset>(Assets[0].value);
  const [toAsset, setToAsset] = useState<Asset>("CUBE");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [error, setError] = useState("");

  const fromBalance =
    fromAsset === "CUBE"
      ? cubesBalance
      : fromAsset === "XTC"
      ? xtcBalance
      : wtcBalance;
  const toBalance =
    toAsset === "CUBE"
      ? cubesBalance
      : toAsset === "XTC"
      ? xtcBalance
      : wtcBalance;

  const xtcDeposit = useXtcDeposit();
  const wtcDeposit = useWtcDeposit();
  const withdraw = useWithdraw();

  const deposit =
    fromAsset === "XTC" ? xtcDeposit : fromAsset === "WTC" ? wtcDeposit : null;

  const mutation = fromAsset === "CUBE" ? withdraw : deposit;

  const max = fromBalance.isSuccess ? Number(fromBalance.data) : 0;
  const fromAmount = Number(fromValue);
  const isInsufficient = !isNaN(fromAmount) && fromAmount > max;

  const calculateAmount = (amount: number) => amount;

  useEffect(() => {
    mutation?.reset();
  }, [fromAsset]);

  const sideRef = useRef<Side>(null);
  const setterWithRef =
    (setter: (arg: string) => void, ref: Side) => (arg: string) => {
      sideRef.current = ref;
      setter(arg);
    };
  useEffect(() => {
    if (fromValue) {
      const fromAmount = Number(fromValue);
      if (sideRef.current === "from" && !isNaN(fromAmount)) {
        setToValue(calculateAmount(fromAmount).toString());
      }
    } else {
      setToValue("");
    }
  }, [fromValue]);

  useEffect(() => {
    if (toValue) {
      const toAmount = Number(toValue);
      if (sideRef.current === "to" && !isNaN(toAmount)) {
        setFromValue(calculateAmount(toAmount).toString());
      }
    } else {
      setFromValue("");
    }
  }, [toValue]);

  const switchSides = () => {
    setFromAsset(toAsset);
    setToAsset(fromAsset === "Cycles" ? "WTC" : fromAsset);
    sideRef.current = null;
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const [_, setIsOpen] = useLoginModal();
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthed) {
      setIsOpen(true);
      return;
    }

    if (isNaN(fromAmount)) {
      setError("Invalid value");
      return;
    }
    if (fromAmount <= 0) {
      return;
    }
    if (fromAsset === "CUBE") {
      withdraw.mutate(
        { asset: toAsset as TcAsset, tcAmount: fromAmount },
        { onSuccess: () => setFromValue("") }
      );
    } else {
      deposit.mutate(fromAmount, { onSuccess: () => setFromValue("") });
    }
  };

  return (
    <div className="flex justify-center my-16">
      <Panel className="max-w-xs w-full p-4">
        <h1 className="text-xl mb-4">Swap CUBE</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          autoComplete="off"
        >
          <AssetForm
            side="from"
            asset={fromAsset}
            balanceQuery={fromBalance}
            setAsset={setFromAsset}
            value={fromValue}
            onChangeValue={setterWithRef(
              setterWithValidation(setFromValue),
              "from"
            )}
            canSetMax={true}
          />

          {fromAsset === "Cycles" ? (
            <>
              <div className="text-sm">
                We recommend using WTC to buy CUBE. If you'd like to use raw
                cycles, use the cycles wallet UI or dfx, and send the desired
                amount to:
                <div className="border border-gray-300 my-2 rounded-md p-2 text-xs">
                  <IdentifierLabelWithButtons
                    type="Principal"
                    id={canisterId}
                  />
                </div>
                The sending principal will be credited with CUBE.
              </div>
              <div className="text-xs text-gray-500 text-right">
                1 TC = 1 CUBE
              </div>
            </>
          ) : (
            <>
              <div className="w-full flex justify-center">
                <div
                  className="rounded-full border-gray-500 border w-10 h-10 flex justify-center items-center group cursor-pointer"
                  onClick={switchSides}
                >
                  <BsArrowDown className="text-xl text-gray-500 transform transition-transform group-hover:-rotate-180 rotate-0" />
                </div>
              </div>

              <AssetForm
                side="to"
                asset={toAsset}
                balanceQuery={toBalance}
                setAsset={setToAsset}
                value={toValue}
                onChangeValue={setterWithRef(
                  setterWithValidation(setToValue),
                  "to"
                )}
              />

              <div className="text-xs text-gray-500 text-right">
                1 {fromAsset} = 1 {toAsset}
              </div>
            </>
          )}

          {error && <ErrorAlert>{error}</ErrorAlert>}

          <SpinnerButton
            className="p-3 w-full"
            activeClassName="btn-cta cursor-pointer"
            disabledClassName="btn-cta-disabled"
            isLoading={mutation?.isLoading}
            isDisabled={isAuthed && (!fromValue || isInsufficient)}
          >
            {isAuthed
              ? isInsufficient
                ? `Insufficient ${fromAsset} balance`
                : `Swap for ${toAsset}`
              : "Login to Buy Cubes"}
          </SpinnerButton>
          {mutation?.error && (
            <ErrorAlert>
              <pre className="w-full whitespace-pre-wrap text-xs break-all">
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : mutation.error}
              </pre>
            </ErrorAlert>
          )}
        </form>
      </Panel>
    </div>
  );
}
