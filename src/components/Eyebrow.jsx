import "./Eyebrow.css";

export default function Eyebrow({ children, className = "" }) {
  return (
    <p className={`eyebrow ${className}`}>
      <span className="eyebrow-dot" aria-hidden="true" />
      {children}
    </p>
  );
}
