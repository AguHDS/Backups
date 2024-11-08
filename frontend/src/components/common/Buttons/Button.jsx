export default function Button({
  onClick = () => {},
  label = "Button",
  type = "button",
  className = "btn btn-primary",
  style,
  id,
}) {
  return (
    <button
    type={type}
      className={`${className}`}
      id={id}
      style={style}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
