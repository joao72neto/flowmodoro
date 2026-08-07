import clsx from "clsx";

export const baseStyle = clsx(
  "px-5",
  "py-2",
  "rounded-lg",
  "font-semibold",
  "text-white",
  "shadow",
  "transition-all",
  "duration-200",
  "ease-in-out",
  "cursor-pointer",
  "hover:scale-105",
  "hover:brightness-110",
  "active:scale-95",
  "disabled:saturate-50",
  "disabled:brightness-75",
  "disabled:cursor-not-allowed",
  "disabled:hover:scale-100",
  "disabled:active:scale-100",
);

export const variants = {
  primary: clsx(baseStyle, "bg-primary"),
  secondary: clsx(baseStyle, "bg-secondary"),
  secondary40: clsx(baseStyle, "bg-secondary/40"),
  danger: clsx(baseStyle, "bg-danger"),
  danger2: clsx(baseStyle, "bg-danger-2"),
  success: clsx(baseStyle, "bg-success"),
  success2: clsx(baseStyle, "bg-success-2"),
};
