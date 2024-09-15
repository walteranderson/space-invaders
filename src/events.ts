interface Events {
  [key: string]: Function[];
}

export class EventEmitter {
  public events: Events;

  constructor(events?: Events) {
    this.events = events || {};
  }

  subscribe(name: string, cb: Function) {
    if (!this.events[name]) this.events[name] = [];
    this.events[name].push(cb);
    return {
      unsubscribe: () =>
        this.events[name] &&
        this.events[name].splice(this.events[name].indexOf(cb) >>> 0, 1),
    };
  }

  emit(name: string, ...args: unknown[]): void {
    (this.events[name] || []).forEach((fn) => fn(...args));
  }
}

export const events = new EventEmitter();
