export const Button = ({
  onClick = () => {},
  label = "Button",
  type = "button",
  className = "backupsBtn",
  style,
  id,
}) => {
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
};
