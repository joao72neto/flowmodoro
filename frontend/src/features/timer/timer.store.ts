import { localStorageKeys } from "../../shared/utils/storage.utils";

type Listener = () => void;

const saved = localStorage.getItem(localStorageKeys.timer);

let seconds = 0;

if (saved) {
  const { mode, seconds: savedSeconds, lastUpdated } = JSON.parse(saved);
  const diff = Math.floor((Date.now() - lastUpdated) / 1000);

  if (mode === "focus") {
    seconds = savedSeconds + diff;
  } else if (mode === "break") {
    seconds = Math.max(0, savedSeconds - diff);
  } else {
    seconds = savedSeconds;
  }
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
