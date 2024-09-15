export class KeyListener {
  private keys: Record<string, boolean>;

  constructor() {
    this.keys = {};
    window.addEventListener("keydown", this.keydown.bind(this));
    window.addEventListener("keyup", this.keyup.bind(this));
  }

  pressed(key: string): boolean {
    return this.keys[key];
  }

  private keydown(event: KeyboardEvent) {
    if (this.keys[event.key]) return;
    this.keys[event.key] = true;
  }

  private keyup(event: KeyboardEvent) {
    delete this.keys[event.key];
  }
}
