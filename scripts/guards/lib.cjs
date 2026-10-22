/**
 * Shared helpers of the app build guards (core/checks/app/README.md): command line, settings, file walk and the
 * self-test runner. The guards came from the Olimpo app (olimpo-react/olimpo/scripts/) on 02/10/2026; the defaults
 * below are the Olimpo layout, so the Olimpo needs almost no settings and any other React + Vite app writes its own
 * app-checks.json.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

// Olimpo layout. Every key can be replaced in app-checks.json, section by section.
const DEFAULTS = {
  src: 'src',
  locales: { dir: 'src/locales', source: 'pt-BR', others: ['en', 'es'], file: 'common.json' },
  i18nUsage: { extensions: ['js', 'jsx', 'ts', 'tsx'] },
  tokens: {
    css: ['src/index.css'],
    darkSelector: '[data-theme="dark"]',
    baseline: 'scripts/.token-baseline.json',
    extensions: ['css', 'jsx', 'ts', 'tsx'],
    ignore: ['src/stories/'],
    skipDirs: ['stories', '__tests__', 'test', 'tests'],
    primitives: ['#ffffff', '#000000'],
    exceptions: {},
    spacingScale: ['2px', '4px', '8px', '12px', '16px', '20px', '24px', '32px', '40px'],
    advisoryHard: false,
  },
  lang: {
    scan: ['src', 'supabase/functions'],
    baseline: 'scripts/lang-baseline.json',
    skipDirs: ['node_modules', 'dist', 'locales', '__tests__', 'stories'],
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    identifiers: [
      'metas', 'meta', 'tarefas', 'tarefa', 'projetos', 'projeto', 'perfil', 'foco',
      'conquistas', 'conquista', 'categoria', 'categorias', 'senha', 'registrar',
      'titulo', 'criar', 'salvar', 'diasUso', 'descricao', 'excluir', 'ativo',
      'deusa', 'deuses', 'deus', 'pontos', 'arquetipo', 'usuario', 'nivel', 'ideia',
      'adiar', 'revisar', 'reagendar', 'lixeira', 'temperamento',
    ],
    extraIdentifiers: [],
    commentWords: ['não', 'então', 'usuário', 'senha', 'conquista', 'meta', 'perfil', 'tarefa', 'deusa?',
      'arquétipo', 'ranking', 'começa', 'também', 'só', 'é'],
  },
  hardcoded: {
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    skipDirs: ['stories', '__tests__', 'test', 'tests', 'locales'],
    skipFiles: ['stories', 'test', 'spec'],
    calls: ['showToast', 'customConfirm', 'openEditModal', 'toast', 'alert', 'confirm'],
  },
  csp: { dist: 'dist', pages: ['index.html'], firebase: 'firebase.json', target: 'app' },
};

// --root=<app folder> (default: current folder), --config=<file> (default: <root>/app-checks.json), other flags as a set.
function parseArgs(argv = process.argv.slice(2)) {
  const opts = {};
  const flags = new Set();
  for (const arg of argv) {
    const m = arg.match(/^--([\w-]+)=(.*)$/);
    if (m) opts[m[1]] = m[2];
    else if (arg.startsWith('--')) flags.add(arg);
  }
  const root = path.resolve(opts.root || process.cwd());
  return { root, configPath: opts.config ? path.resolve(opts.config) : path.join(root, 'app-checks.json'), opts, flags };
}

// Settings: the defaults, with each section of app-checks.json merged over its default section.
function loadConfig(configPath) {
  const user = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
  const config = {};
  for (const [key, value] of Object.entries(DEFAULTS)) {
    const own = user[key];
    config[key] = value && typeof value === 'object' && !Array.isArray(value) ? { ...value, ...(own || {}) } : (own ?? value);
  }
  return config;
}

const toPosix = (p) => p.replace(/\\/g, '/');
const relative = (root, p) => toPosix(path.relative(root, p));
const extRegex = (extensions) => new RegExp('\\.(' + extensions.join('|') + ')$');
const asList = (value) => (Array.isArray(value) ? value : [value]);

// The command that runs this guard again with the same --root and --config, for the hints printed on failure.
function selfCommand(scriptFile, flag) {
  const kept = process.argv.slice(2).filter((a) => /^--(root|config)=/.test(a)).map((a) => (/\s/.test(a) ? `"${a}"` : a));
  return ['node', `"${toPosix(scriptFile)}"`, ...kept, flag].join(' ');
}

/**
 * Self-test (ERROS F25): each case is a small app written in a temp folder; the guard runs on it as a child process
 * and must exit with the expected code (1 for the must-catch case, 0 for the must-pass case).
 * case: { name, files: { 'relative/path': 'content' }, args: [], expect: 0|1, expectText: 'text the output must have' }
 */
function runSelfTest(scriptFile, cases) {
  let ok = true;
  for (const c of cases) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'app-check-'));
    try {
      for (const [file, content] of Object.entries(c.files)) {
        const full = path.join(dir, file);
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, typeof content === 'string' ? content : JSON.stringify(content, null, 2));
      }
      const run = spawnSync(process.execPath, [scriptFile, '--root=' + dir, ...(c.args || [])], { encoding: 'utf8' });
      const output = (run.stdout || '') + (run.stderr || '');
      const pass = run.status === c.expect && (!c.expectText || output.includes(c.expectText));
      if (!pass) ok = false;
      console.log(`${pass ? 'ok    ' : 'FAILED'} ${c.name} (exit ${run.status}, expected ${c.expect})`);
      if (!pass) console.log(output.split('\n').map((l) => '         ' + l).join('\n'));
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  console.log('self-test: ' + (ok ? 'passed' : 'FAILED'));
  process.exit(ok ? 0 : 1);
}

module.exports = { DEFAULTS, parseArgs, loadConfig, toPosix, relative, extRegex, asList, selfCommand, runSelfTest };
