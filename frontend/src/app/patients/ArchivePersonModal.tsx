import React from "react";
import { gql, useMutation } from "@apollo/client";
import Modal from "react-modal";
import Button from "../commonComponents/Button";
import { displayFullName, showNotification, showError } from "../utils";
import "./ArchivePersonModal.scss";
import { Patient } from "./ManagePatients";
import Alert from "../commonComponents/Alert";
import { toast } from "react-toastify";

const ARCHIVE_PERSON_RECORD = gql`
  mutation ArchivePerson($id: String!, $deleted: Boolean!) {
    setPatientIsDeleted(id: $id, deleted: $deleted) {
      internalId
    }
  }
`;

interface Props {
  person: Patient;
  closeModal: () => void;
}
interface ArchivePersonResponse {
  internalId: string;
}
interface ArchivePersonParams {
  id: string;
  deleted: boolean;
}
const ArchivePersonModal = ({ person, closeModal }: Props) => {
  const [archivePersonRecord] = useMutation<
    ArchivePersonResponse,
    ArchivePersonParams
  >(ARCHIVE_PERSON_RECORD);
  const yesArchivePerson = () => {
    archivePersonRecord({
      variables: {
        id: person.internalId,
        deleted: true,
      },
    })
      .then(() => {
        const alert = <Alert type="success" title="Record archived" body="" />;
        showNotification(toast, alert);
      })
      .catch((e) => {
        showError(toast, String(e));
      })
      .finally(() => {
        closeModal();
      });
  };

  return (
    <Modal
      isOpen={true}
      className="sr-archive-person-modal-content"
      overlayClassName="sr-archive-person-modal-overlay"
      contentLabel="Archive record"
    >
      <p>
        Are you sure you want to archive the record for{" "}
        <b>
          {displayFullName(
            person.firstName,
            person.middleName,
            person.lastName
          )}
        </b>
        ?
      </p>
      <div className="sr-archive-person-buttons">
        <Button variant="unstyled" label="No, go back" onClick={closeModal} />
        <Button label="Yes, I'm sure" onClick={yesArchivePerson} />
      </div>
    </Modal>
  );
};

export default ArchivePersonModal;