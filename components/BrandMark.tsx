import Image from "next/image";

interface BrandMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandMark({ className = "h-8 w-8", size = "lg" }: BrandMarkProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8", 
    lg: "h-10 w-10"
  };

  return (
    <Image
      src="/saps-logo-white.png"
      alt="SAPS"
      width={32}
      height={32}
      className={`${sizeClasses[size]} ${className}`}
      priority
    />
  );
}
