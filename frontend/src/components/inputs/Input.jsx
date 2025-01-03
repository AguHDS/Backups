export const Input = ({
  className = "text-sm rounded-lg w-full p-2.5 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400",
  type = "text",
  id = undefined,
  name = "",
  value = "",
  checked = false,
  onChange = () => {},
  placeholder = "",
  disabled = false,
  required = false,
  autocomplete = "off",
}) => {
  return (
    <input
      className={`${className}`}
      type={type}
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      autoComplete={autocomplete}
    />
  );
};
