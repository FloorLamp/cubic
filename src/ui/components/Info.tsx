import React from "react";
import { CgSpinner } from "react-icons/cg";
import { useInfo } from "../lib/hooks/useInfo";
import { extErrorToString, formatNumber } from "../lib/utils";
import IdentifierLabelWithButtons from "./Buttons/IdentifierLabelWithButtons";
import Panel from "./Containers/Panel";
import ErrorAlert from "./Labels/ErrorAlert";

export function Info() {
  const { data, isLoading, error } = useInfo();

  return (
    <>
      <Panel className="max-w-sm w-full p-4 flex flex-col gap-4">
        <h1 className="text-2xl">Cubic Stats</h1>
        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Unique Owners
          </label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">{formatNumber(data.stats.ownerCount)}</h2>
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Total Transaction Volume
          </label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">
              {formatNumber(Number(data.stats.salesTotal) / 1e12, 12)} Cubes
            </h2>
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Transaction Count
          </label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">
              {formatNumber(data.stats.transactionsCount)}
            </h2>
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Fees Collected
          </label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">
              {formatNumber(Number(data.stats.feesCollected) / 1e12, 12)} TC
            </h2>
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase">
            WTC Balance
          </label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : "ok" in data.stats.wtcBalance ? (
            <h2 className="font-bold">
              {formatNumber(Number(data.stats.wtcBalance.ok) / 1e12, 12)} WTC
            </h2>
          ) : (
            <ErrorAlert>
              {extErrorToString(data.stats.wtcBalance.err)}
            </ErrorAlert>
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase">
            XTC Balance
          </label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">
              {formatNumber(Number(data.stats.xtcBalance) / 1e12, 12)} XTC
            </h2>
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Cycles Balance
          </label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <h2 className="font-bold">
              {formatNumber(Number(data.stats.cyclesBalance) / 1e12, 12)} TC
            </h2>
          )}
        </div>
      </Panel>

      <Panel className="max-w-sm w-full p-4 flex flex-col gap-4">
        <h2 className="text-xl">Canisters</h2>

        <div>
          <label className="block text-gray-500 text-xs uppercase">WTC</label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <IdentifierLabelWithButtons
              type="Principal"
              id={data.canisters.wtc}
            />
          )}
        </div>

        <div>
          <label className="block text-gray-500 text-xs uppercase">XTC</label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            <IdentifierLabelWithButtons
              type="Principal"
              id={data.canisters.xtc}
            />
          )}
        </div>
      </Panel>
    </>
  );
}
