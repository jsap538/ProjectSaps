import Image from "next/image";

interface BrandMarkProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandMark({ className = "h-10 w-10", size = "md" }: BrandMarkProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  };

  return (
    <Image
      src="/saps-logo-white-10x.png"
      alt="SAPS"
      width={160}
      height={160}
      className={`${sizeClasses[size]} ${className}`}
      priority
    />
  );
}
