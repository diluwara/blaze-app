import React, { ReactNode } from "react";
import classes from "./Card.module.scss";

interface CardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className={classes.card}>{children}</div>;
};

export default Card;
