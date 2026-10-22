// Runs the build guards kept in scripts/guards/, a copy of the flowforge common guards
// (https://github.com/joaomob/flowforge, core/checks/app). The copy makes the repository run on its own, in CI or on a
// machine without the flowforge. When the flowforge is on this machine and its guards changed, a warning says so and
// `node scripts/app-checks.cjs --sync` brings the new version in.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const local = path.join(__dirname, 'guards');
const upstream = path.join(os.homedir(), 'Documents', 'flowforge', 'core', 'checks', 'app');
const files = fs.readdirSync(local).filter((f) => f.endsWith('.cjs'));

const args = process.argv.slice(2);
if (args.includes('--sync')) {
  for (const f of files) fs.copyFileSync(path.join(upstream, f), path.join(local, f));
  console.log(`app-checks: ${files.length} guards copied from ${upstream}`);
  process.exit(0);
}
if (fs.existsSync(upstream)) {
  const stale = files.filter(
    (f) =>
      fs.existsSync(path.join(upstream, f)) &&
      fs.readFileSync(path.join(upstream, f), 'utf8') !== fs.readFileSync(path.join(local, f), 'utf8'),
  );
  if (stale.length)
    console.warn(`app-checks: the flowforge has a newer ${stale.join(', ')}; run node scripts/app-checks.cjs --sync`);
}
// Options such as --update or --update-baseline go to every guard named in the same call
const flags = args.filter((a) => a.startsWith('--'));
for (const name of args.filter((a) => !a.startsWith('--'))) {
  const run = spawnSync(
    process.execPath,
    [path.join(local, `check-${name}.cjs`), '--root=' + path.resolve(__dirname, '..'), ...flags],
    { stdio: 'inherit' },
  );
  if (run.status !== 0) process.exit(run.status ?? 1);
}
