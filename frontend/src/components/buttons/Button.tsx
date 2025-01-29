import React, { CSSProperties } from "react";

interface ButtonProps {
  onClick?: () => void;
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export const Button = ({
  onClick = () => {},
  label = "Button",
  type = "button",
  className = "backupsBtn",
  style,
  id,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={className}
      style={style}
      id={id} >
      {label}
    </button>
  );
};