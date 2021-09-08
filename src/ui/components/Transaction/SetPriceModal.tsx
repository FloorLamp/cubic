import classNames from "classnames";
import Link from "next/link";
import React, { useState } from "react";
import { BsFillExclamationCircleFill } from "react-icons/bs";
import { FiChevronRight } from "react-icons/fi";
import { useCubesBalance } from "../../lib/hooks/useCubesBalance";
import useId from "../../lib/hooks/useId";
import { useInfo } from "../../lib/hooks/useInfo";
import useSetPrice from "../../lib/hooks/useSetPrice";
import { useSummary } from "../../lib/hooks/useSummary";
import { formatNumber } from "../../lib/utils";
import SpinnerButton from "../Buttons/SpinnerButton";
import ErrorAlert from "../Labels/ErrorAlert";
import { TokenLabel, TokenLogo } from "../Labels/TokenLabel";
import Modal from "../Layout/Modal";
import { useGlobalContext, useLoginModal } from "../Store/Store";

export const SetPriceForm = ({ closeModal }: { closeModal: () => void }) => {
  const id = useId();
  const {
    state: { isAuthed },
  } = useGlobalContext();
  const info = useInfo();

  const [error, setError] = useState("");
  const mutation = useSetPrice({ id });
  const summary = useSummary({ id });
  const cubesBalance = useCubesBalance();

  const [newOffer, setNewOffer] = useState(
    summary.status.offerValue.toString()
  );
  const newOfferAmount = Number(newOffer);

  const dailyTax =
    newOfferAmount && info.data
      ? ((Number(info.data.stats.annualTaxRate) / 1e8) * newOfferAmount) / 365
      : 0;

  const ownershipPeriod =
    dailyTax > 0 && cubesBalance.isSuccess && summary
      ? cubesBalance.data / dailyTax
      : null;

  const [_, setLoginIsOpen] = useLoginModal();
  const handleClick = (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthed) {
      setLoginIsOpen(true);
      return;
    }

    let amount;
    try {
      amount = BigInt(newOfferAmount * 1e12);
    } catch (error) {
      setError(error.message);
      return;
    }
    mutation.mutate(amount, {
      onSuccess: closeModal,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {cubesBalance.isSuccess && summary && (
        <>
          <div className="flex justify-between border-b border-t border-gray-300 py-2 mt-2">
            <label>Current Offer Price</label>
            <span>
              <strong>{formatNumber(summary?.status.offerValue, 12)}</strong>{" "}
              <TokenLogo />
            </span>
          </div>

          <div>
            <div className="pt-4 w-full flex justify-between items-center">
              <label>Change your Offer Price</label>
              <input
                type="button"
                className="text-xs px-2 py-1 cursor-pointer btn-secondary"
                value="Set to Current"
                onClick={() =>
                  summary && setNewOffer(summary.status.offerValue.toString())
                }
              />
            </div>
            <div className="relative">
              <div className="absolute px-3 pt-4 pointer-events-none">
                <TokenLabel />
              </div>
              <input
                type="number"
                placeholder="Offer Price"
                className="w-full mt-1 flex-1 text-right"
                value={newOffer}
                onChange={(e) => setNewOffer(e.target.value)}
                min={0}
                maxLength={20}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <label>Daily tax </label>
              <span>
                <strong>{dailyTax ? formatNumber(dailyTax) : "—"}</strong>{" "}
                <TokenLogo />
              </span>
            </div>

            {isAuthed && (
              <>
                <div className="flex justify-between">
                  <label>Est. ownership period</label>
                  <span>
                    <strong>
                      {ownershipPeriod ? formatNumber(ownershipPeriod, 2) : "—"}
                    </strong>{" "}
                    days
                  </span>
                </div>
                {ownershipPeriod != null && ownershipPeriod < 0.02 && (
                  <ErrorAlert>
                    <p className="text-sm p-1">
                      <strong className="flex items-center">
                        <BsFillExclamationCircleFill className="mr-1" />
                        You may be foreclosed!
                      </strong>
                      Ensure you have sufficient balance for taxes.
                    </p>
                  </ErrorAlert>
                )}
              </>
            )}

            <Link href="/info">
              <a className="group text-xs text-gray-400 hover:underline">
                How does this work?
                <FiChevronRight className="inline-block group-hover:translate-x-1 transform transition-transform duration-75" />
              </a>
            </Link>
          </div>

          {error && <ErrorAlert>{error}</ErrorAlert>}
        </>
      )}

      <SpinnerButton
        className="mt-4 p-3 w-full"
        activeClassName="btn-cta cursor-pointer"
        disabledClassName="btn-cta-disabled"
        onClick={handleClick}
        isLoading={mutation.isLoading}
        isDisabled={isAuthed && !newOffer}
      >
        Save
      </SpinnerButton>

      {mutation.error && (
        <ErrorAlert>
          <pre className="w-full whitespace-pre-wrap text-xs break-all">
            {mutation.error instanceof Error
              ? mutation.error.message
              : mutation.error}
          </pre>
        </ErrorAlert>
      )}
    </div>
  );
};

export default function SetPriceModal() {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const summary = useSummary({ id });

  const modalDisabled = summary && !summary.details.isActive;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={classNames("w-full p-2", {
          "btn-cta": !modalDisabled,
          "cursor-not-allowed btn-cta-disabled": modalDisabled,
        })}
        disabled={modalDisabled}
      >
        {modalDisabled ? "Project not active" : "Change Offer Price"}
      </button>
      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title="Change Price"
      >
        {summary && <SetPriceForm closeModal={closeModal} />}
      </Modal>
    </>
  );
}
