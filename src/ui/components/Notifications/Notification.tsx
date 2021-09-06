import { Transition } from "@headlessui/react";
import React, { ReactNode, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export const Notification = ({
  open = true,
  handleClose,
  children,
  autoCloseDelay,
}: {
  open?: boolean;
  handleClose: () => void;
  children: ReactNode;
  autoCloseDelay?: number;
}) => {
  useEffect(() => {
    if (open && autoCloseDelay) {
      setTimeout(handleClose, autoCloseDelay);
    }
  }, [open]);

  return (
    <Transition
      show={open}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="shadow-xl bg-white px-4 py-3 rounded-sm">
        <div className="relative pr-8">
          <button
            type="button"
            className="absolute top-0 right-0 rounded cursor-pointer transition-colors bg-gray-100 dark:bg-gray-800 disabled:bg-gray-100 dark:disabled:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:cursor-not-allowed p-1"
            onClick={handleClose}
          >
            <FaTimes />
          </button>
          {children}
        </div>
      </div>
    </Transition>
  );
};
