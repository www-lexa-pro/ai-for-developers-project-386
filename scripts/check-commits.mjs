import { execFileSync } from 'node:child_process';

// Initial course commits predate the project's Conventional Commits policy.
const base = '02cdd5a';
execFileSync('npm', ['exec', 'commitlint', '--', '--from', base, '--to', 'HEAD'], { stdio: 'inherit' });
