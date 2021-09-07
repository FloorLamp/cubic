import { DateTime } from "luxon";
import React, { useState } from "react";
import { ProjectDetails_v2 } from "../../declarations/Cubic/Cubic.did";
import { padProjectId } from "../../lib/blocks";
import { useInfo } from "../../lib/hooks/useInfo";
import { useIsController } from "../../lib/hooks/useIsController";
import useNewProject from "../../lib/hooks/useNewProject";
import SpinnerButton from "../Buttons/SpinnerButton";
import ErrorAlert from "../Labels/ErrorAlert";
import Modal from "../Layout/Modal";

const NewProjectForm = ({ closeModal }: { closeModal: () => void }) => {
  const { data } = useInfo();
  const [creator, setCreator] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createdTime, setCreatedTime] = useState(
    DateTime.utc().toISO({
      includeOffset: false,
    })
  );
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const mutation = useNewProject();

  const handleClick = (e) => {
    e.preventDefault();
    setError("");

    let request: ProjectDetails_v2;
    try {
      request = {
        creator,
        name,
        description,
        createdTime: BigInt(
          Math.floor(DateTime.fromISO(createdTime).toSeconds())
        ),
        isActive,
      };
    } catch (error) {
      return setError(error.message);
    }
    console.log({ request });

    mutation.mutate(request, {
      onSuccess: closeModal,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <>
        <h2>Project {data ? padProjectId(data.projectCount) : null}</h2>
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            placeholder="Name"
            className="w-full mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block">Description</label>
          <textarea
            placeholder="Description"
            className="w-full mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block">Creator</label>
          <input
            type="text"
            placeholder="Creator"
            className="w-full mt-1"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block">Created Time</label>
          <input
            type="datetime-local"
            placeholder="Created Time"
            className="w-full mt-1"
            value={createdTime}
            onChange={(e) => setCreatedTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="mr-1"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
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
        isLoading={mutation.isLoading}
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

export default function NewProjectButton() {
  const isController = useIsController();

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  if (!isController) {
    return null;
  }

  return (
    <>
      <button type="button" onClick={openModal} className="px-3 py-1 btn-cta">
        New Project
      </button>
      <Modal
        isOpen={isOpen}
        openModal={openModal}
        closeModal={closeModal}
        title="New Project"
      >
        <NewProjectForm closeModal={closeModal} />
      </Modal>
    </>
  );
}
