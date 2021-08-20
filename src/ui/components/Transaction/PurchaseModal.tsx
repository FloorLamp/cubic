import Link from "next/link";
import React, { useState } from "react";
import useBuy from "../../lib/hooks/useBuy";
import { useCubesBalance } from "../../lib/hooks/useCubesBalance";
import { useInfo } from "../../lib/hooks/useInfo";
import { useStatus } from "../../lib/hooks/useStatus";
import { formatNumber } from "../../lib/utils";
import SpinnerButton from "../Buttons/SpinnerButton";
import ErrorAlert from "../Labels/ErrorAlert";
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
    dailyTax > 0 && cubesBalance.isSuccess
      ? cubesBalance.data / dailyTax
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

  const hasSufficientBalance = cubesBalance.data > status.data?.offerValue;

  return (
    <>
      <button type="button" onClick={openModal} className="w-full p-2 btn-cta">
        Buy Cubic
      </button>
      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title="Purchase Cubic"
      >
        <div className="flex flex-col gap-4">
          {cubesBalance.isSuccess &&
            status.data &&
            (hasSufficientBalance ? (
              <>
                <label className="block">
                  Set your new Offer Price
                  <div className="mt-1 xs:flex gap-2">
                    <input
                      type="number"
                      placeholder="New Offer Price"
                      className="flex-1"
                      value={newOffer}
                      onChange={(e) => setNewOffer(e.target.value)}
                      min={0}
                      maxLength={20}
                    />
                  </div>
                </label>

                {error && <ErrorAlert>{error}</ErrorAlert>}

                <p>
                  You will spend{" "}
                  <strong>{formatNumber(status.data?.offerValue, 12)}</strong>{" "}
                  Cubes now to purchase Cubic.
                </p>

                <p>
                  You will be charged{" "}
                  <strong>{dailyTax ? formatNumber(dailyTax) : "-"}</strong>{" "}
                  Cubes per day while you are the owner.
                </p>

                <p>
                  Based on your current Cubes balance, you will be able to own
                  Cubic for{" "}
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
                    {formatNumber(status.data?.offerValue, 12)} Cubes
                  </h2>
                </div>
                <div>
                  <label className="block">Your balance</label>
                  <h2 className="text-xl font-bold text-right">
                    {formatNumber(cubesBalance.data, 12)} Cubes
                  </h2>
                </div>
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
