interface VerbCardSceneProps {
  verbId: string;
  src: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  onError?: () => void;
}

const IMAGE_OVERRIDES: Record<string, string> = {
  "v8-0266": "/cards/overrides/0266.svg",
};

export default function VerbCardScene({
  verbId,
  src,
  alt,
  className = "",
  loading = "lazy",
  onError,
}: VerbCardSceneProps) {
  const override = IMAGE_OVERRIDES[verbId];
  const imageSrc = override || src;
  const isCombinedEnglishCard = !override;

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onError={onError}
        className={
          isCombinedEnglishCard
            ? "absolute left-1/2 top-[48.5%] h-[190%] w-[190%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover"
            : "h-full w-full object-contain"
        }
      />
    </div>
  );
}
