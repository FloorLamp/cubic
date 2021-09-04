import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import React from "react";
import { CgSpinner } from "react-icons/cg";
import { FiChevronRight } from "react-icons/fi";
import { cubicName } from "../lib/blocks";
import { useStatus } from "../lib/hooks/useStatus";
import { assetUrl } from "../lib/url";
import { formatNumber } from "../lib/utils";
import Panel from "./Containers/Panel";
import { TokenLogo } from "./Labels/TokenLabel";

export const Preview = ({ artId }: { artId: string }) => {
  const router = useRouter();
  const { data, isLoading } = useStatus({ artId });

  return (
    <Panel className="p-6">
      <div
        className="group cursor-pointer"
        onClick={() => router.push(`/a/${artId}`)}
      >
        {artId === "0" && <img src={assetUrl("000.svg")} className="w-full" />}
        <Link href={`/a/${artId}`}>
          <a className="pt-2 inline-flex gap-1 items-center group font-bold hover:underline">
            <span>{cubicName(artId)}</span>
            <FiChevronRight className="inline-block group-hover:translate-x-1 transform transition-transform duration-75" />
          </a>
        </Link>
      </div>
      <div className="pt-2 flex justify-between">
        <div>
          <label className="block text-gray-500 text-xs uppercase">
            Current Price
          </label>
          {isLoading ? (
            <CgSpinner className="inline-block animate-spin" />
          ) : (
            data && (
              <strong className="inline-flex items-center">
                {formatNumber(data.status.offerValue, 12)} <TokenLogo />
              </strong>
            )
          )}
        </div>
      </div>
    </Panel>
  );
};
