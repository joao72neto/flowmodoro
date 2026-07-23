type Listener = () => void;

let seconds = 0;
let listeners: Listener[] = [];

export function setTick(value: number) {
  seconds = value;
  listeners.forEach((l) => l());
}

export function getTick() {
  return seconds;
}

export function subscribeTick(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
