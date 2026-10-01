export default function Emblem() {
  return (
    <svg
      viewBox="0 0 64 64"
      width="44"
      height="44"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="32" cy="32" r="23" strokeWidth="2" />
      <circle cx="32" cy="32" r="17" />
      {Array.from({ length: 16 }, (_, i) => (
        <path
          key={i}
          d="M32 4v11"
          strokeWidth="2"
          transform={`rotate(${i * 22.5} 32 32)`}
        />
      ))}
      <path
        d="M17 21q15 22 30 0M15 28q17 21 34 0M21 17q22 15 0 30M28 15q21 17 0 34"
        strokeWidth="1.5"
      />
    </svg>
  );
}
