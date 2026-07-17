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
    <div
      className={`relative flex !h-auto aspect-[1.27/1] w-full items-center justify-center overflow-hidden bg-white ${className}`}
    >
      {isCombinedEnglishCard ? (
        <img
          src={imageSrc}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={onError}
          className="absolute left-[-25.6%] top-[-42.6%] w-[151.2%] max-w-none"
        />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          loading={loading}
          decoding="async"
          onError={onError}
          className="h-full w-full object-contain"
        />
      )}
    </div>
  );
}
