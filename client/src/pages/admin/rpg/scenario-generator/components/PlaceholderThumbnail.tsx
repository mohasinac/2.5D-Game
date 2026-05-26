interface Props {
  dataUrl: string;
  size?: number;
  label?: string;
}

export function PlaceholderThumbnail({ dataUrl, size = 32, label }: Props) {
  return (
    <div className="flex items-center gap-2">
      <img
        src={dataUrl}
        width={size}
        height={size}
        className="border border-gray-700 rounded"
        style={{ imageRendering: "pixelated" }}
        alt={label ?? "placeholder"}
      />
      {label && <span className="text-gray-300 text-xs">{label}</span>}
    </div>
  );
}
