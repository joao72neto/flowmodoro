import { localStorageKeys } from "../../shared/utils/storage.utils";

type Listener = () => void;

const saved = localStorage.getItem(localStorageKeys.timer);

let seconds = 0;

if (saved) {
  const { mode, seconds: savedSeconds, lastUpdated } = JSON.parse(saved);
  const diff = Math.floor((Date.now() - lastUpdated) / 1000);

  seconds =
    mode === "focus" ? savedSeconds + diff : Math.max(0, savedSeconds - diff);
}

let listeners: Listener[] = [];

export function setSeconds(value: number) {
  seconds = value;
  listeners.forEach((l) => l());
}

export function getSeconds() {
  return seconds;
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
