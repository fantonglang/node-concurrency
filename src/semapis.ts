const NativeExtension = require('bindings')('NativeExtension');

export function sem_open(name: string, oflag: number, mode: number, value: number): any {
  return NativeExtension.sem_open(name, oflag, mode, value);
}

export function sem_close(sem: any): number {
  return NativeExtension.sem_close(sem);
}

export function sem_post(sem: any): number {
  return NativeExtension.sem_post(sem);
}

export function sem_trywait(sem: any): number {
  return NativeExtension.sem_trywait(sem);
}

export function sem_unlink(name: string): number {
  return NativeExtension.sem_unlink(name);
}

export function sem_wait(sem: any): number {
  return NativeExtension.sem_wait(sem);
}