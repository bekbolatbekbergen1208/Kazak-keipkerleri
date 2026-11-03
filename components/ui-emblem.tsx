/** Shanyrak and open-book emblem for the Kazakh Heroes platform. */
export default function Emblem() {
  return (
    <svg
      className="brand-emblem"
      viewBox="0 0 64 64"
      width="44"
      height="44"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 5 54 15v20c0 12-22 24-22 24S10 47 10 35V15Z" />
      <path d="M21 28a11 11 0 0 1 22 0 M24 27q8-9 16 0 M32 17v11 M25 19l4 9 M39 19l-4 9" />
      <path d="M32 48c-5-4-11-5-16-5V31c6 0 11 2 16 5 5-3 10-5 16-5v12c-5 0-11 1-16 5Z M32 36v12 M21 36l6 2 M37 38l6-2" />
    </svg>
  );
}
