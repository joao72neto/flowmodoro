import { v4 as uuidv4 } from "uuid";

export const localStorageKeys = {
  timer: "flowmodoro_timer_state",
  restRatio: "flowmodoro_rest_ratio",
  session: "flowmodoro_session",

  userId: "flowmodoro_anonymous_user_id",
  theme: "flowmodoro_theme",
  authUser: "flowmodoro_auth_user",
};

export const sessionStorageKeys = {
  sessionTitle: "flowmodoro_session_title",
  isSessionGroupOpen: (id: string) => `flowmodoro_is_session_group_open_${id}`,
};

export const getAnonymousUserId = (): string => {
  let id = localStorage.getItem(localStorageKeys.userId);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(localStorageKeys.userId, id);
  }
  return id;
};

export const getStorageObject = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? { ...fallback, ...JSON.parse(item) } : fallback;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
    return fallback;
  }
};
