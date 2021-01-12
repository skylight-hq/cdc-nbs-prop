import React from "react";
import Modal from "react-modal";

import "./AoEModalForm.scss";
import AoEForm from "./AoEForm";

// Get the value associate with a button label
// TODO: move to utility?
const findValueForLabel = (label, list) =>
  (list.filter((item) => item.label === label)[0] || {}).value;

const AoEModalForm = ({
  saveButtonText = "Save",
  onClose,
  patient,
  facilityId,
  loadState = {},
  saveCallback,
}) => {
  return (
    <Modal
      isOpen={true}
      style={{
        content: {
          inset: "3em auto auto auto",
          overflow: "auto",
          maxHeight: "90vh",
          width: "50%",
          minWidth: "20em",
          marginRight: "50%",
          transform: "translate(50%, 0)",
        },
      }}
      overlayClassName="prime-modal-overlay"
      contentLabel="Time of Test Questions"
    >
      <AoEForm
        saveButtonText="Save"
        onClose={onClose}
        patient={patient}
        facilityId={facilityId}
        loadState={loadState}
        saveCallback={saveCallback}
        isModal={true}
      ></AoEForm>
    </Modal>
  );
};

AoEModalForm.propTypes = {};

export default AoEModalForm;
