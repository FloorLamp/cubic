import Link from "next/link";
import React, { useState } from "react";
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
        <div className="flex flex-col gap-4">
          {cubesBalance.isSuccess &&
            status.data &&
            (hasSufficientBalance ? (
              <>
                <p className="border-b border-gray-300 pb-4">
                  You will spend{" "}
                  <strong>
                    {formatNumber(status.data?.status.offerValue, 12)}
                  </strong>{" "}
                  <TokenLogo /> now to purchase this work.
                </p>

                <div>
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

                {error && <ErrorAlert>{error}</ErrorAlert>}

                <p>
                  You will be charged{" "}
                  <strong>{dailyTax ? formatNumber(dailyTax) : "-"}</strong>{" "}
                  <TokenLogo /> per day while you are the owner.
                </p>

                <p>
                  Based on your current balance, you will be able to own this
                  work for{" "}
                  <strong>
                    {ownershipPeriod ? formatNumber(ownershipPeriod, 2) : "-"}
                  </strong>{" "}
                  days.
                </p>
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

          {hasSufficientBalance ? (
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
