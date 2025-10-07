import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function PrimaryButton({ children, className = "", onClick, disabled, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-xl px-5 py-3
        bg-porcelain text-ink font-medium tracking-wide1
        transition-transform duration-sap hover:-translate-y-px
        focus:outline-none focus:ring-2 focus:ring-porcelain/40
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = "", onClick, disabled, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-xl px-5 py-3
        border border-porcelain/20 text-porcelain/90
        hover:bg-porcelain/5 transition-colors duration-sap
        focus:outline-none focus:ring-2 focus:ring-porcelain/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", onClick, disabled, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-xl px-5 py-3
        bg-graphite text-porcelain font-medium
        hover:bg-onyx transition-colors duration-sap
        focus:outline-none focus:ring-2 focus:ring-titanium/20
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, className = "", onClick, disabled, type = "button" }: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center rounded-xl px-5 py-3
        bg-red-600 text-white font-medium
        hover:bg-red-700 transition-colors duration-sap
        focus:outline-none focus:ring-2 focus:ring-red-500/40
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
}
