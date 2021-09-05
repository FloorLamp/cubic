import { useRouter } from "next/dist/client/router";
import React from "react";
import { CgSpinner } from "react-icons/cg";
import { FiChevronRight } from "react-icons/fi";
import { padProjectId } from "../lib/blocks";
import { useArt } from "../lib/hooks/useArt";
import { useStatus } from "../lib/hooks/useStatus";
import { assetUrl } from "../lib/url";
import { formatNumber } from "../lib/utils";
import Panel from "./Containers/Panel";
import { TokenLogo } from "./Labels/TokenLabel";

export const Preview = ({ artId }: { artId: string }) => {
  const router = useRouter();
  const { data, isLoading } = useStatus({ artId });
  const { data: art } = useArt({ artId });

  return (
    <Panel className="p-6 w-full max-w-xs">
      <div
        className="group cursor-pointer"
        onClick={() => router.push(`/p/${artId}`)}
      >
        {artId === "0" && <img src={assetUrl("000.svg")} className="w-full" />}
        {artId === "1" && <img src={assetUrl("001.svg")} className="w-full" />}
        <a className="pt-2 inline-flex gap-1 items-center group font-bold hover:underline">
          <span>
            {padProjectId(artId)}
            {" — "}
            {art ? art[0]?.name : "—"}
          </span>
          <FiChevronRight className="inline-block group-hover:translate-x-1 transform transition-transform duration-75" />
        </a>
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
