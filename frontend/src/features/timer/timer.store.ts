type Listener = () => void;

let seconds = 0;
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
