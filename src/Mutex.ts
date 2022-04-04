import Sem from "./sem";

export default class Mutex {
  private _sem: Sem|null = null
  static delete(name: string): number {
    return Sem.delete(name);
  }
  static open(name: string): Mutex {
    const sem = Sem.open(name, 1);
    const m = new Mutex();
    m._sem = sem;
    return m;
  }
  close(): void {
    this._sem!.close();
  }
  trywait(): number {
    return this._sem!.trywait();
  }
  wait(): void {
    this._sem!.wait();
  }
  post(): void {
    this._sem!.post();
  }
  acquire(): Promise<() => void> {
    return this._sem!.acquire();
  }
  runExclusive(func: () => any): Promise<any> {
    return this._sem!.runExclusive(func);
  }
}