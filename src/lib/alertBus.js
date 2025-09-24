// Simple in-memory alert bus to publish alert count across screens
let listeners = [];
let current = 0;

export function subscribe(fn) {
  listeners.push(fn);
  // send current immediately
  fn(current);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
}

export function publish(count) {
  current = count;
  listeners.forEach(fn => {
    try { fn(count); } catch (e) { console.warn('alertBus listener error', e); }
  });
}

export function getCount() {
  return current;
}
