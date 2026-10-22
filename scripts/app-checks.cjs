// Runs the common build guards of the flowforge (~/Documents/flowforge/core/checks/app/README.md).
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const dir = path.join(os.homedir(), 'Documents', 'flowforge', 'core', 'checks', 'app');
if (!fs.existsSync(dir)) {
  console.error(`flowforge not found at ${dir}: git clone https://github.com/joaomob/flowforge ~/Documents/flowforge`);
  process.exit(1);
}
// Options such as --update or --update-baseline go to every guard named in the same call
const args = process.argv.slice(2);
const flags = args.filter(a => a.startsWith('--'));
for (const name of args.filter(a => !a.startsWith('--'))) {
  const run = spawnSync(process.execPath, [path.join(dir, `check-${name}.cjs`), '--root=' + path.resolve(__dirname, '..'), ...flags], { stdio: 'inherit' });
  if (run.status !== 0) process.exit(run.status ?? 1);
}
