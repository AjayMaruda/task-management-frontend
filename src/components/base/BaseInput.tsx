import React from "react";

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  wrapperClassName?: string;
}

export const BaseInput: React.FC<BaseInputProps> = ({
  label,
  error,
  touched,
  required,
  id,
  wrapperClassName = "",
  className = "",
  ...props
}) => {
  const hasError = touched && !!error;

  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-slate-300 text-sm font-medium mb-1.5 select-none"
        >
          {label}
          {required && (
            <span
              className="text-rose-500 ml-0.5"
              aria-hidden="true"
              title="Required"
            >
              *
            </span>
          )}
        </label>
      )}

      <input
        id={id}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        className={[
          "w-full px-3 py-2.5 rounded-lg text-slate-200 text-sm",
          "bg-slate-900 border outline-none",
          "placeholder:text-slate-600",
          "transition-all duration-200",
          "focus:ring-2",
          hasError
            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-500/5"
            : "border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      />

      <span
        id={`${id}-error`}
        role="alert"
        className={[
          "text-rose-400 text-xs mt-1.5 flex items-center gap-1 overflow-hidden transition-all duration-200",
          hasError ? "max-h-10 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        {hasError && (
          <>
            <svg
              className="shrink-0 w-3 h-3"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 10.5a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5zM7.25 5.5a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-1.5 0v-3z" />
            </svg>
            {error}
          </>
        )}
      </span>
    </div>
  );
};
