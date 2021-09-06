import { useRouter } from "next/dist/client/router";
import React from "react";
import { CgSpinner } from "react-icons/cg";
import { FiChevronRight } from "react-icons/fi";
import { padProjectId } from "../../lib/blocks";
import { useDetails } from "../../lib/hooks/useDetails";
import { useStatus } from "../../lib/hooks/useStatus";
import { formatNumber } from "../../lib/utils";
import Panel from "../Containers/Panel";
import { TokenLogo } from "../Labels/TokenLabel";
import Asset from "./Asset";

export const Preview = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, isLoading } = useStatus({ id });
  const { data: details } = useDetails({ id });

  return (
    <Panel className="p-6 w-full max-w-xs">
      <div
        className="group cursor-pointer flex flex-col"
        onClick={() => router.push(`/p/${id}`)}
      >
        <div style={{ width: 250, height: 250 }}>
          <Asset id={id} />
        </div>
        <a className="pt-2 inline-flex gap-1 items-center group font-bold hover:underline">
          <span>
            {padProjectId(id)}
            {" — "}
            {details ? details[0]?.name : "—"}
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
