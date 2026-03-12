import { InputHTMLAttributes } from "react";

export default function Radio({
  className = "",
  disabled,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="radio"
      disabled={disabled}
      className={`
        rounded-sm
        text-accent-main
        shadow-sm
        border-gray-700
        bg-gray-900
        focus:ring-accent-main
        focus:ring-offset-gray-800
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${className}
      `}
    />
  );
}