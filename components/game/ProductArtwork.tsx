import Image from "next/image";

// Show only the product area of the supplied reference, excluding app chrome.
const frames: Record<string, string> = {
  "image14.png": "1190 303 535 713",
  "image15.png": "780 518 790 400",
  "image17.png": "1537 564 274 276",
};
export default function ProductArtwork({
  image,
  title,
}: {
  image: string;
  title: string;
}) {
  const frame = frames[image];
  if (!frame)
    return (
      <Image
        src={`/presentation/${image}`}
        alt={title}
        width={400}
        height={400}
      />
    );
  const [x, y, width, height] = frame.split(" ").map(Number);
  return (
    <svg
      viewBox={frame}
      role="img"
      aria-label={title}
      className="product-artwork"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <svg
        x={x}
        y={y}
        width={width}
        height={height}
        viewBox={frame}
        overflow="hidden"
      >
        <image href={`/presentation/${image}`} width="1920" height="1080" />
      </svg>
    </svg>
  );
}
