export const localStorageKeys = {
  timer: "flowmodoro_timer_state",
  restRatio: "flowmodoro_rest_ratio",
  session: "flowmodoro_session",

  userId: "flowmodoro_anonymous_user_id",
  theme: "flowmodoro_theme",
};

export const sessionStorageKeys = {
  sessionTitle: "flowmodoro_session_title",
};

export const getAnonymousUserId = (): string => {
  let id = localStorage.getItem(localStorageKeys.userId);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(localStorageKeys.userId, id);
  }
  return id;
};
