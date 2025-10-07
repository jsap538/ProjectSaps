interface BrandMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandMark({ className = "h-8 w-8", size = "md" }: BrandMarkProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  };

  return (
    <svg 
      viewBox="0 0 64 64" 
      className={`${sizeClasses[size]} ${className}`} 
      aria-label="SAPS mark" 
      role="img"
      fill="currentColor"
    >
      {/* Geometric lapel motif - minimalist, architectural */}
      <path d="M32 6 L20 22 L26 46 L32 34 L38 46 L44 22 Z" fill="currentColor" />
      <circle cx="32" cy="50" r="2" fill="currentColor" />
      <rect x="30" y="52" width="4" height="6" fill="currentColor" />
    </svg>
  );
}
