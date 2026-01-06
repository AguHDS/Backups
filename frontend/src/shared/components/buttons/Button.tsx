import type { CSSProperties, KeyboardEvent } from "react";

interface ButtonProps {
  onClick?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement>) => void;
  label?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  style?: CSSProperties;
  id?: string;
  disabled?: boolean;
}

export const Button = ({
  onClick = () => {},
  onKeyDown,
  label = "Button",
  type = "button",
  className = "backupsBtn",
  style,
  id,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      onKeyDown={onKeyDown}
      type={type}
      className={className}
      style={style}
      id={id}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
