// Starts the Storybook of the HubSpot dev server (@hubspot/cms-dev-server --storybook) on Windows. The dev server spawns
// storybook/bin/index.cjs directly, which Windows refuses (spawn EFTYPE), so the flag stops there. This script runs the
// same command through node, with the project config in .storybook (the dev server config, fixed for Windows).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const THEME = path.join(ROOT, 'src', 'theme', 'litora-react');
const require = createRequire(path.join(THEME, 'package.json'));

const sbDir = path.dirname(require.resolve('storybook/package.json'));
const bin = path.join(sbDir, JSON.parse(fs.readFileSync(path.join(sbDir, 'package.json'), 'utf8')).bin.storybook);
// .storybook reuses the config of the dev server and fixes its stories glob on Windows
const configPath = path.join(THEME, '.storybook');

const port = process.env.STORYBOOK_PORT ?? '3123';
const child = spawn(process.execPath, [bin, 'dev', '-p', port, '-c', configPath, '--quiet', '--no-open'], {
  cwd: THEME,
  env: { ...process.env, WEB_ROOT: path.join(THEME, 'components') },
  stdio: 'inherit',
});
child.on('exit', (code) => process.exit(code ?? 0));
