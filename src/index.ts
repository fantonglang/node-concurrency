import Sem from './sem';
import process from 'process';

async function main() {
  const signals = ['SIGTERM', 'SIGINT', 'SIGBUS', 'SIGSEGV', 'SIGFPE', 'SIGABRT'];
  for (const sig of signals) {
    process.on(sig, () => {
      console.log('cleanup');
      Sem.cleanup();
      process.exit();
    });
  }
  const args = process.argv.slice(2);
  const sem = Sem.open('/sem1', 1);
  const release = await sem.acquire();
  console.log('wait ok');
  if (args.length == 0) {
    await wait4(10);
  }
  console.log('post');
  release();
}

function wait4(s: number) {
  return new Promise((resolve: Function) => {
    setTimeout(() => {
      resolve();
    }, s*1000);
  })
}

main();