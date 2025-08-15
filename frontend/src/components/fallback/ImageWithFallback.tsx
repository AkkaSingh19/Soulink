import React, { useState } from "react";

const DEFAULT_ERROR_IMG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  style,
  className,
  fallbackSrc = DEFAULT_ERROR_IMG,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  return didError ? (
    <div
      className={`bg-gray-100 flex items-center justify-center ${className ?? ""}`}
      style={style}
    >
      <img
        src={fallbackSrc}
        alt={alt ? `${alt} (failed to load)` : "Image failed to load"}
        className="object-contain max-w-full max-h-full"
        {...rest}
        data-original-url={src}
      />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  );
}
