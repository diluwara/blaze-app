import React, { ReactNode } from "react";
import classes from "./Button.module.scss";

interface Props {
  name?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  outline?: boolean;
  children: ReactNode;
}

const Button: React.FC<Props> = ({
  type = "button",
  onClick,
  outline,
  children,
  name,
}) => {
  return (
    <button
      name={name}
      className={`${classes.btn} ${outline ? classes.outline : classes.button}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
