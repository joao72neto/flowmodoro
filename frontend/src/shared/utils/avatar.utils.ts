/**
 * Extracts up to 2 uppercase initials from a name or email.
 * Examples: "João Neto" -> "JN", "maria" -> "M", "alex@email.com" -> "A"
 */
export const getInitials = (nameOrEmail: string): string => {
  const cleaned = nameOrEmail.trim();

  if (!cleaned) return "?";

  // If it looks like an email, use the part before @
  const name = cleaned.includes("@") ? cleaned.split("@")[0] : cleaned;

  const parts = name.split(/\s+/).filter((part) => part.length > 0);

  if (parts.length === 0) return "?";

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
