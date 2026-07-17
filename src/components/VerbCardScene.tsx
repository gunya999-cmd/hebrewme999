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
  const imageSrc = IMAGE_OVERRIDES[verbId] || src;

  return (
    <div className={`relative w-full overflow-hidden bg-white ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onError={onError}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
