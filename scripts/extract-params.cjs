// One-off: reads the params of each dnd_module/module tag of a HubL template of the Litora theme as JSON.
const fs = require('fs');
const [file, out] = process.argv.slice(2);
const text = fs.readFileSync(file, 'utf8');
const result = [];
const re = /\{%\s*(?:dnd_module|module\s+"[^"]+")\s+path="([^"]+)",([\s\S]*?)%\}/g;
const BACKSLASH = String.fromCharCode(92);
let m;
while ((m = re.exec(text))) {
  const body = m[2];
  const params = {};
  let i = 0;
  const skip = () => {
    while (i < body.length && /[\s,]/.test(body[i])) i++;
  };
  while (true) {
    skip();
    if (i >= body.length) break;
    const k = /^[A-Za-z_]\w*/.exec(body.slice(i));
    if (!k) throw new Error('key at ' + body.slice(i, i + 40));
    i += k[0].length;
    if (body[i] !== '=') throw new Error('= expected after ' + k[0]);
    i++;
    const start = i;
    let depth = 0,
      inStr = false;
    for (; i < body.length; i++) {
      const c = body[i];
      if (inStr) {
        if (c === BACKSLASH) i++;
        else if (c === '"') {
          inStr = false;
          if (depth === 0) {
            i++;
            break;
          }
        }
        continue;
      }
      if (c === '"') {
        inStr = true;
        continue;
      }
      if (c === '{' || c === '[') depth++;
      else if (c === '}' || c === ']') {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      } else if (depth === 0 && /[,\s]/.test(c)) break;
    }
    const raw = body.slice(start, i).trim();
    params[k[0]] = raw === 'true' ? true : raw === 'false' ? false : JSON.parse(raw);
  }
  result.push({ module: m[1].split('/').pop(), params });
}
fs.writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
console.log(result.map((r) => r.module + ' ' + Object.keys(r.params).length).join('\n'));
