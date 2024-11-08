export default function Input({
  className = "form-control",
  type = "text",
  id = undefined,
  name = undefined,
  value = "",
  checked = false,
  onChange = () => {},
  placeholder = "",
  disabled = false,
  required = false,
  autocomplete = "off",
}) {
  const chboxClass = type === "checkbox" ? "form-check-input" : "";

  return (
    <input
      className={`${className} ${chboxClass}`}
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
    ></input>
  );
}
