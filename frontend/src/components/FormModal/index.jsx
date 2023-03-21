import React from "react";
import Dialog from "@mui/material/Dialog";
const FormModal = ({ modal, setModal, Form, partialData }) => {

  const handleAction = (responseData) => {
    responseData ? modal.action(responseData) : modal.action();
    setModal((prev) => ({ ...prev, open: false }))
  }

  return (
    <Dialog
      PaperProps={{
        style: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          minWidth: '40vw',
          maxWidth: '80vw'
        },
      }}
      open={modal.open}
      onClose={() => setModal((prev) => ({ ...prev, open: false }))}
    >
      <Form id={modal.info} executeAction={handleAction} partialData={partialData} />
    </Dialog>
  );
};

export default FormModal;
