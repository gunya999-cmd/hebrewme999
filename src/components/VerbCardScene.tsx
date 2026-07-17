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

const SCENE_FRAME = {
  width: "147.692308%",
  left: "-23.846154%",
  top: "-40.291262%",
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

  return (
    <div
      className={`relative w-full overflow-hidden bg-white ${className}`}
      style={{ height: "auto", aspectRatio: "520 / 412" }}
    >
      <img
        src={imageSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        onError={onError}
        className={override ? "h-full w-full object-contain" : "absolute max-w-none"}
        style={
          override
            ? undefined
            : {
                width: SCENE_FRAME.width,
                height: "auto",
                left: SCENE_FRAME.left,
                top: SCENE_FRAME.top,
              }
        }
      />
    </div>
  );
}
