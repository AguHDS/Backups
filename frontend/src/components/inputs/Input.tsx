import React, { ChangeEvent, CSSProperties } from "react";

interface InputProps {
  className?: string;
  type?: "text" | "password" | "email" | "number" | "tel" | "url" | "search" | "date" | "datetime-local" | "month" | "time" | "week" | "color" | "checkbox" | "radio" | "file";
  id?: string;
  name?: string;
  value?: string | number;
  checked?: boolean;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: "on" | "off";
  style?: CSSProperties;
}

export const Input = ({
  className = "text-sm rounded-lg w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400",
  type = "text",
  id,
  name = "",
  value = "",
  checked = false,
  onChange = () => {},
  placeholder = "",
  disabled = false,
  required = false,
  autoComplete = "off",
  style,
}: InputProps) => {
  return (
    <input
      className={className}
      type={type}
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      style={style}
    />
  );
};
