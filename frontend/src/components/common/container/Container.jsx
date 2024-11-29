export default function Container({ children, className }) {
  return <div className={`mx-auto ${className}`}>{children}</div>;
}
