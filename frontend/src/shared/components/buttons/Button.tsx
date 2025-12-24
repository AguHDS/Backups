import type { CSSProperties, KeyboardEvent } from "react";

interface ButtonProps {
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export const Button = ({
  onClick = () => {},
  onKeyDown,
  label = "Button",
  type = "button",
  className = "backupsBtn",
  style,
  id,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      type={type}
      className={className}
      style={style}
      id={id} >
      {label}
    </button>
  );
};