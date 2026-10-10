import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('========================================================');
console.log('       INTERACTIVE NETSIM - DUAL RUNTIME LAUNCHER       ');
console.log('========================================================\n');

// 1. Start Node.js Express + Socket.IO Server
console.log('[Launcher] Starting Node.js backend on http://localhost:4000...');
const serverProc = spawn('node', ['server/src/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// 2. Start Vite Frontend Dev Server
console.log('[Launcher] Starting Vite frontend on http://localhost:3000...');
const clientProc = spawn('npm', ['--prefix', 'client', 'run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

process.on('SIGINT', () => {
  serverProc.kill();
  clientProc.kill();
  process.exit(0);
});
