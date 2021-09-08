import { DateTime } from "luxon";
import React, { useState } from "react";
import { SetDetailsRequest } from "../../declarations/Cubic/Cubic.did";
import { useIsController } from "../../lib/hooks/useIsController";
import useSetDetails from "../../lib/hooks/useSetDetails";
import { useSummary } from "../../lib/hooks/useSummary";
import SpinnerButton from "../Buttons/SpinnerButton";
import ErrorAlert from "../Labels/ErrorAlert";
import Modal from "../Layout/Modal";

const EditProjectForm = ({
  id,
  closeModal,
}: {
  id: string;
  closeModal: () => void;
}) => {
  const { details } = useSummary({ id });
  const [creator, setCreator] = useState(details.creator);
  const [name, setName] = useState(details.name);
  const [description, setDescription] = useState(details.description);
  const [createdTime, setCreatedTime] = useState(
    details.createdTime
      ? DateTime.fromSeconds(Number(details.createdTime)).toISO({
          includeOffset: false,
        })
      : ""
  );
  const [isActive, setIsActive] = useState(details.isActive);
  const [changed, setChanged] = useState({});
  const [error, setError] = useState("");
  const setDetails = useSetDetails({ id });

  const handleClick = (e) => {
    e.preventDefault();
    setError("");

    const request: Omit<SetDetailsRequest, "projectId"> = {
      creator: [],
      name: [],
      description: [],
      createdTime: [],
      isActive: [],
    };
    for (const key of Object.keys(changed)) {
      if (key === "createdTime") {
        if (createdTime) {
          try {
            request[key] = [
              BigInt(Math.floor(DateTime.fromISO(createdTime).toSeconds())),
            ];
          } catch (error) {
            return setError(error.message);
          }
        }
      } else if (key === "creator") {
        request[key] = [creator];
      } else if (key === "name") {
        request[key] = [name];
      } else if (key === "description") {
        request[key] = [description];
      } else if (key === "isActive") {
        request[key] = [isActive];
      }
    }
    console.log({ request });

    setDetails.mutate(request, {
      onSuccess: closeModal,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <>
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            placeholder="Name"
            className="w-full mt-1"
            value={name}
            onChange={(e) => {
              setChanged((s) => ({ ...s, name: true }));
              setName(e.target.value);
            }}
          />
        </div>

        <div>
          <label className="block">Description</label>
          <textarea
            placeholder="Description"
            className="w-full mt-1"
            value={description}
            onChange={(e) => {
              setChanged((s) => ({ ...s, description: true }));
              setDescription(e.target.value);
            }}
          />
        </div>

        <div>
          <label className="block">Creator</label>
          <input
            type="text"
            placeholder="Creator"
            className="w-full mt-1"
            value={creator}
            onChange={(e) => {
              setChanged((s) => ({ ...s, creator: true }));
              setCreator(e.target.value);
            }}
          />
        </div>

        <div>
          <label className="block">Created Time</label>
          <input
            type="datetime-local"
            placeholder="Created Time"
            className="w-full mt-1"
            value={createdTime}
            onChange={(e) => {
              setChanged((s) => ({ ...s, createdTime: true }));
              setCreatedTime(e.target.value);
            }}
          />
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="mr-1"
              checked={isActive}
              onChange={(e) => {
                setChanged((s) => ({ ...s, isActive: true }));
                setIsActive(e.target.checked);
              }}
            />
            Active
          </label>
        </div>

        {error && <ErrorAlert>{error}</ErrorAlert>}
      </>

      <SpinnerButton
        className="p-3 w-full"
        activeClassName="btn-cta cursor-pointer"
        disabledClassName="btn-cta-disabled"
        onClick={handleClick}
        isLoading={setDetails.isLoading}
      >
        Save
      </SpinnerButton>

      {setDetails.error && (
        <ErrorAlert>
          <pre className="w-full whitespace-pre-wrap text-xs break-all">
            {setDetails.error instanceof Error
              ? setDetails.error.message
              : setDetails.error}
          </pre>
        </ErrorAlert>
      )}
    </div>
  );
};

export default function EditProjectButton({ id }: { id: string }) {
  const isController = useIsController();
  const summary = useSummary({ id });

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  if (!isController) {
    return null;
  }

  return (
    <>
      <button type="button" onClick={openModal} className="px-3 py-1 btn-cta">
        Edit
      </button>
      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title="Edit Project"
      >
        {summary && <EditProjectForm id={id} closeModal={closeModal} />}
      </Modal>
    </>
  );
}
