export const localStorageKeys = {
  timer: "flowmodoro_timer_state",
  restRatio: "flowmodoro_rest_ratio",
  userId: "flowmodoro_anonymous_user_id",
};

export const getAnonymousUserId = (): string => {
  let id = localStorage.getItem(localStorageKeys.userId);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(localStorageKeys.userId, id);
  }
  return id;
};
