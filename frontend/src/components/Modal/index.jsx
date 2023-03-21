import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import * as S from "./styles";
import Button from "../Button";
import Card from '../Card';
import TextField from "../TextField";

const Modal = ({ modal, setModal }) => {

  const handleAction = () => {
    modal.action();
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
      <Card title={modal.title}>
        <DialogContentText>
          Tem certeza que deseja excluir?
        </DialogContentText>

        <DialogContentText>
          <TextField
            elsize="small"
            label="nome"
            value={modal.info}
          />
        </DialogContentText>

        <DialogActions>
          <Button secondary onButtonClick={() => setModal((prev) => ({ ...prev, open: false }))}>Cancelar</Button>
          <Button onButtonClick={handleAction} autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Card>
    </Dialog>
  );
};

export default Modal;
