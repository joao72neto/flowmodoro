export const formatAuthError = (error: unknown): string => {
  if (!error) return "Ocorreu um erro inesperado.";

  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }
  if (message.includes("User already registered")) {
    return "Este e-mail já está cadastrado.";
  }
  if (message.includes("Password should be at least")) {
    return "A senha deve conter no mínimo 6 caracteres.";
  }
  if (message.includes("Email not confirmed")) {
    return "E-mail ainda não confirmado. Verifique sua caixa de entrada.";
  }
  if (message.includes("rate limit") || message.includes("Rate limit")) {
    return "Muitas tentativas. Aguarde alguns instantes e tente novamente.";
  }
  if (message.includes("Auth session missing")) {
    return "Sessão expirada. Faça login novamente.";
  }

  return message;
};
