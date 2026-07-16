import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode | string;
  rightIcon?: React.ReactNode | string;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white border border-indigo-500 shadow-indigo-500/20",
  secondary:
    "bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 border border-slate-600",
  danger:
    "bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white border border-rose-500 shadow-rose-500/20",
  ghost:
    "bg-transparent hover:bg-slate-700/40 active:bg-slate-700/70 text-slate-300 border border-slate-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2.5",
};

/** Inline SVG spinner — zero external deps */
const Spinner: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={`animate-spin ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const renderIcon = (icon: React.ReactNode | string, sizeClass: string) => {
  if (typeof icon === "string") {
    return <i className={`${icon} ${sizeClass}`} aria-hidden="true" />;
  }
  return <>{icon}</>;
};

export const BaseButton: React.FC<BaseButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}) => {
  const isDisabled = disabled || loading;

  const spinnerSize: Record<ButtonSize, string> = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const iconSize: Record<ButtonSize, string> = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  return (
    <button
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        "inline-flex items-center justify-center font-semibold rounded-lg",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500",
        "active:scale-[0.97]",
        "shadow-sm hover:shadow-md",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? "w-full" : "",
        isDisabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {/* Left icon / spinner */}
      {loading ? (
        <Spinner className={spinnerSize[size]} />
      ) : (
        leftIcon && renderIcon(leftIcon, iconSize[size])
      )}

      {children && <span>{children}</span>}

      {/* Right icon (hidden while loading) */}
      {!loading && rightIcon && renderIcon(rightIcon, iconSize[size])}
    </button>
  );
};
