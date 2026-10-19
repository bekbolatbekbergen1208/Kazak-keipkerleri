import Image from "next/image";

// Reproduce the picture crops stored in slide 6 without altering the source files.
const crops: Record<
  string,
  { width: number; height: number; left: number; right: number }
> = {
  "/presentation/image7.png": {
    width: 678,
    height: 469,
    left: 0.2013,
    right: 0.32759,
  },
  "/presentation/image9.png": {
    width: 1907,
    height: 670,
    left: 0,
    right: 0.74218,
  },
  "/presentation/image10.png": {
    width: 1055,
    height: 464,
    left: 0.356,
    right: 0.40218,
  },
};
export default function HeroArtwork({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  const crop = crops[src];
  if (!crop)
    return (
      <Image src={src} alt={alt} width={350} height={460} priority={priority} />
    );
  const fraction = 1 - crop.left - crop.right;
  return (
    <span
      className="hero-artwork-crop"
      style={{ aspectRatio: `${crop.width * fraction} / ${crop.height}` }}
    >
      <Image
        src={src}
        alt={alt}
        width={crop.width}
        height={crop.height}
        priority={priority}
        style={{
          width: `${100 / fraction}%`,
          left: `${(-100 * crop.left) / fraction}%`,
        }}
      />
    </span>
  );
}
