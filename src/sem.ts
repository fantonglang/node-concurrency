import { sem_close, sem_open, sem_post, sem_trywait, sem_unlink, sem_wait } from "./semapis";

export default class Sem {
  static semIndexedByName: any = {}
  private _sem: any = null
  private _name: string = ''
  static delete(name: string): number {
    if (Object.keys(Sem.semIndexedByName).indexOf(name) >= 0) {
      throw new Error(`can't delete the semaphore [${name}] which is still open`);
    }
    return sem_unlink(name);
  }
  static cleanup(): void {
    const names = Object.keys(Sem.semIndexedByName);
    for (const name of names) {
      const {sem, n} = Sem.semIndexedByName[name];
      for(let i=0; i<n; ++i) {
        sem_post(sem);
      }
      sem_close(sem);
    }
    Sem.semIndexedByName = {};
  }
  static open(name: string, value: number): Sem {
    const existing = Sem.semIndexedByName[name];
    if (existing) {
      throw new Error(`can't open the semaphore [${name}] which is still open`);
    }
    const sem = sem_open(name, 0x00000200, 0o644, value);
    if (!sem) {
      throw new Error(`error: can't open the semaphore [${name}]`);
    }
    const s = new Sem();
    s._sem = sem;
    s._name = name;
    Sem.semIndexedByName[name] = {
      sem: sem,
      n: 0
    };
    return s;
  }
  close(): void {
    const existing: any = Sem.semIndexedByName[this._name];
    if (!existing) {
      throw new Error(`can't close the semaphore [${this._name}] which is not open`);
    }
    const {sem, n} = existing;
    for(let i=0; i<n; ++i) {
      sem_post(sem);
    }
    const closeRes = sem_close(this._sem);
    if (closeRes) {
      throw new Error(`error: can't close the semaphore [${this._name}]`);
    }
    delete Sem.semIndexedByName[this._name];
  }
  trywait(): number {
    const existing: any = Sem.semIndexedByName[this._name];
    if (!existing) {
      throw new Error(`can't wait the semaphore [${this._name}] which is not open`);
    }
    const waitRes = sem_trywait(this._sem);
    if (waitRes) {
      return waitRes;
    }
    existing.n++;
    return 0;
  }
  wait(): void {
    const existing: any = Sem.semIndexedByName[this._name];
    if (!existing) {
      throw new Error(`can't wait the semaphore [${this._name}] which is not open`);
    }
    const waitRes = sem_wait(this._sem);
    if (waitRes) {
      throw new Error(`wait semaphore [${this._name}] failed`);
    }
    existing.n++;
    return;
  }
  post(): void {
    const existing: any = Sem.semIndexedByName[this._name];
    if (!existing) {
      throw new Error(`can't post the semaphore [${this._name}] which is not open`);
    }
    existing.n--;
    const postRes = sem_post(this._sem);
    if (postRes) {
      throw new Error(`post semaphore [${this._name}] failed`);
    }
  }
  acquire(): Promise<() => void> {
    return new Promise((resolve, reject) => {
      try {
        this.wait();
        resolve(() => {
          this.post();
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  runExclusive(func: () => any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.wait();
      } catch (err) {
        reject(err);
        return;
      }
      let res = null;
      let _err = null;
      try {
        res = func();
      } catch (err) {
        _err = err;
      }
      try {
        this.post();
      } catch (err) {
        _err || (_err = err);
      }
      if (!_err) {
        resolve(res);
      } else {
        reject(_err);
      }
    });
  }
}