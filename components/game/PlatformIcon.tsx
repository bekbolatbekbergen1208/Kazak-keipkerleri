import {
  BookOpen,
  Cat,
  Compass,
  House,
  MessageCircle,
  Rabbit,
  ScrollText,
  Shield,
  Sparkles,
  Sun,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
/** Shared vector marks: fixed stroke weight, no emoji or platform-dependent glyphs. */
export default function PlatformIcon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  const paths: Record<string, React.ReactNode> = {
    recognize: (
      <>
        <path d="M20 12h24l7 8v19L32 53 13 39V20Z" />
        <path d="M23 23q9-15 18 0v6H23Z M22 29h20 M28 35v5h8v-5 M20 47q12-9 24 0" />
        <path d="M29 19v6m6-6v6" />
      </>
    ),
    traits: (
      <>
        <path d="M32 10 50 18v17c0 10-18 20-18 20S14 45 14 35V18Z" />
        <path d="M32 41 22 31a6 6 0 0 1 10-6 6 6 0 0 1 10 6Z" />
        <path d="M10 10 6 6m48 4 4-4M32 6V2" />
      </>
    ),
    national: (
      <>
        <path d="M24 17c-12-4-18 8-10 16-7 10 2 20 11 14 5-4 9-4 14 0 10 7 20-5 11-15 8-10-1-22-11-15-5 4-10 4-15 0Z" />
        <path d="M21 25q-5 4 0 9m21-9q5 4 0 9M27 34q5-4 10 0" />
        <path d="M18 54h28 M25 58h14" />
      </>
    ),
    quiz: (
      <>
        <path d="M32 49c-8-5-17-5-23-3V15c8-2 15-1 23 4 8-5 15-6 23-4v31c-6-2-15-2-23 3Z M32 19v30" />
        <path d="m19 30 4 4 6-8 M38 26h10 M38 33h10 M38 40h6" />
        <path d="M18 53q14 10 28 0" />
      </>
    ),
  };
  if (paths[name])
    return (
      <svg
        className={`platform-icon ${className}`}
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {paths[name]}
      </svg>
    );
  const icons = {
    book: BookOpen,
    hero: Shield,
    wisdom: MessageCircle,
    sun: Sun,
    trophy: Trophy,
    trail: Compass,
    magic: Sparkles,
    words: ScrollText,
    fox: Cat,
    rabbit: Rabbit,
    home: House,
    horse: Zap,
    friends: Users,
  };
  const Icon = icons[name as keyof typeof icons] ?? BookOpen;
  return (
    <Icon
      className={`platform-icon ${className}`}
      strokeWidth={1.6}
      aria-hidden="true"
    />
  );
}
