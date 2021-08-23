import Link from "next/link";
import React, { useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import useBuy from "../../lib/hooks/useBuy";
import { useCubesBalance } from "../../lib/hooks/useCubesBalance";
import { useInfo } from "../../lib/hooks/useInfo";
import { useStatus } from "../../lib/hooks/useStatus";
import { formatNumber } from "../../lib/utils";
import SpinnerButton from "../Buttons/SpinnerButton";
import ErrorAlert from "../Labels/ErrorAlert";
import { TokenLabel, TokenLogo } from "../Labels/TokenLabel";
import Modal from "../Layout/Modal";
import { useGlobalContext } from "../Store/Store";

export default function PurchaseModal({}: {}) {
  const {
    state: { isAuthed },
  } = useGlobalContext();
  const info = useInfo();

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [newOffer, setNewOffer] = useState("");
  const [error, setError] = useState("");
  const buy = useBuy();
  const status = useStatus();
  const cubesBalance = useCubesBalance();
  const newOfferAmount = Number(newOffer);

  const dailyTax =
    newOfferAmount && info.data
      ? ((Number(info.data.stats.annualTaxRate) / 1e8) * newOfferAmount) / 365
      : 0;

  const ownershipPeriod =
    dailyTax > 0 && cubesBalance.isSuccess && status.data
      ? (cubesBalance.data - status.data.status.offerValue) / dailyTax
      : null;

  const handleClick = (e) => {
    e.preventDefault();
    setError("");

    let amount;
    try {
      amount = BigInt(newOfferAmount * 1e12);
    } catch (error) {
      setError(error.message);
      return;
    }
    buy.mutate(amount, {
      onSuccess: closeModal,
    });
  };

  const hasSufficientBalance =
    cubesBalance.data > status.data?.status.offerValue;

  return (
    <>
      <button type="button" onClick={openModal} className="w-full p-2 btn-cta">
        Purchase
      </button>
      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title="Complete Purchase"
      >
        <div className="flex flex-col gap-2 pt-4">
          {cubesBalance.isSuccess &&
            status.data &&
            (!isAuthed || hasSufficientBalance ? (
              <>
                <div className="flex justify-between border-t border-b border-gray-300 py-4">
                  <label>Current Price</label>
                  <span>
                    <strong>
                      {formatNumber(status.data?.status.offerValue, 12)}
                    </strong>{" "}
                    <TokenLogo />
                  </span>
                </div>

                <div className="pt-2">
                  <div className="w-full flex justify-between items-center">
                    <label>Your Offer Price</label>
                    <input
                      type="button"
                      className="text-xs px-2 py-1 cursor-pointer btn-secondary"
                      value="Set to Current"
                      onClick={() =>
                        status.data &&
                        setNewOffer(status.data.status.offerValue.toString())
                      }
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute p-3.5 pointer-events-none">
                      <TokenLabel />
                    </div>
                    <input
                      type="number"
                      placeholder="New Offer Price"
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
                    <div className="flex justify-between">
                      <label>Est. ownership period</label>
                      <span>
                        <strong>
                          {ownershipPeriod
                            ? formatNumber(ownershipPeriod, 2)
                            : "—"}
                        </strong>{" "}
                        days
                      </span>
                    </div>
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
            ) : (
              <>
                <div>
                  <label className="block">Current offer price</label>
                  <h2 className="text-xl font-bold text-right">
                    {formatNumber(status.data?.status.offerValue, 12)}{" "}
                    <TokenLabel />
                  </h2>
                </div>
                <div>
                  <label className="block">Your balance</label>
                  <h2 className="text-xl font-bold text-right">
                    {formatNumber(cubesBalance.data, 12)} <TokenLabel />
                  </h2>
                </div>
                <p className="text-red-500">
                  Insufficient balance for purchase and taxes.
                </p>
              </>
            ))}

          {!isAuthed || hasSufficientBalance ? (
            <SpinnerButton
              className="p-3 w-full"
              activeClassName="btn-cta cursor-pointer"
              disabledClassName="btn-cta-disabled"
              onClick={handleClick}
              isLoading={buy.isLoading}
              isDisabled={!isAuthed || !newOffer}
            >
              {isAuthed ? "Buy" : "Login to Buy"}
            </SpinnerButton>
          ) : (
            <Link href="/cubes">
              <a className="p-3 w-full btn-cta rounded-md text-center">
                Buy more Cubes
              </a>
            </Link>
          )}

          {buy.error && (
            <ErrorAlert>
              <pre className="w-full whitespace-pre-wrap text-xs break-all">
                {buy.error instanceof Error ? buy.error.message : buy.error}
              </pre>
            </ErrorAlert>
          )}
        </div>
      </Modal>
    </>
  );
}
