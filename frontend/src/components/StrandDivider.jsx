// Signature visual motif: a flowing strand of hair, used under headings/logo
const StrandDivider = ({ center = false, className = "" }) => (
  <svg
    className={`strand-divider ${center ? "center" : ""} ${className}`}
    viewBox="0 0 120 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M2 9 C 20 -2, 34 20, 52 9 S 84 -2, 100 9 S 116 16, 118 9" />
  </svg>
);

export default StrandDivider;
