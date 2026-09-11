import { localStorageKeys } from "../../shared/utils/storage.utils";

type Listener = () => void;

const timerSaved = localStorage.getItem(localStorageKeys.timer);
const savedRatio = localStorage.getItem(localStorageKeys.restRatio);

let seconds = 0;
let totalFocus = 0;
let ratio = 20;

if (timerSaved) {
  const { mode, seconds: savedSeconds, lastUpdated } = JSON.parse(timerSaved);
  const diff = Math.floor((Date.now() - lastUpdated) / 1000);

  if (mode === "focus") {
    seconds = savedSeconds + diff;
  } else if (mode === "break") {
    seconds = Math.max(0, savedSeconds - diff);
  } else {
    seconds = savedSeconds;
  }
}

if (savedRatio) {
  const saved = JSON.parse(savedRatio);
  ratio = Number(saved);
}

let listeners: Listener[] = [];

export function setSeconds(value: number) {
  seconds = value;
  listeners.forEach((l) => l());
}

export function getSeconds() {
  return seconds;
}

export function setTotalFocus(value: number) {
  totalFocus = value;
  listeners.forEach((l) => l());
}

export function getTotalFocus() {
  return totalFocus;
}

export function setRatio(value: number) {
  ratio = value;
  localStorage.setItem(localStorageKeys.restRatio, JSON.stringify(value));
  listeners.forEach((l) => l());
}

export function getRatio() {
  return ratio;
}

export function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
