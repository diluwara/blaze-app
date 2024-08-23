import React from "react";
import ReactDOM from "react-dom";
import { useTranslation } from "react-i18next";
import classes from "./Modal.module.scss";
import Card from "../card/Card";
import Button from "../button/Button";

interface IBackdrop {
  onConfirm: () => void;
}

const Backdrop: React.FC<IBackdrop> = ({ onConfirm }) => {
  return <div className={classes.backdrop} onClick={onConfirm}></div>;
};

interface IModal {
  title: string;
  message: string;
  onConfirm: () => void;
  children?: React.ReactNode;
}

const ModalOverlay: React.FC<IModal> = ({
  title,
  message,
  onConfirm,
  children,
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <div className={classes.modal}>
        <header className={classes.header}>
          <h3>{title}</h3>
        </header>
        <div className={classes.content}>
          <p>{message}</p>
          {children}
        </div>
        <footer className={classes.actions}>
          <Button outline onClick={onConfirm}>
            {t("close").toString()}
          </Button>
        </footer>
      </div>
    </Card>
  );
};

const Modal: React.FC<IModal> = (props) => {
  const backdropRoot = document.getElementById("backdrop-root") as HTMLElement;
  const modalOverlayRoot = document.getElementById(
    "overlay-root"
  ) as HTMLElement;

  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onConfirm={props.onConfirm} />,
        backdropRoot
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          onConfirm={props.onConfirm}
        >
          {props.children}
        </ModalOverlay>,
        modalOverlayRoot
      )}
    </>
  );
};

export default Modal;
