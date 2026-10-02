// Loads game scripts into a VM sandbox (no DOM) for headless testing.
const fs = require('fs'), path = require('path'), vm = require('vm');
const WWW = path.join(__dirname, '..', 'app/src/main/assets/www');
function loadFiles(files) {
  const sandbox = { console, Math, JSON, Date, Object, Array, Set, Map, Float32Array, Float64Array, Uint8Array, Uint16Array, Int16Array, Int32Array, Uint32Array, String, Number, isNaN, parseFloat, parseInt, setTimeout, localStorage: (() => { const s = {}; return { getItem: k => s[k] ?? null, setItem: (k, v) => { s[k] = String(v); }, removeItem: k => { delete s[k]; } }; })() };
  sandbox.window = sandbox; sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  for (const f of files) {
    const code = fs.readFileSync(path.join(WWW, f), 'utf8');
    try { vm.runInContext(code, sandbox, { filename: f }); } catch (e) { console.error('ERROR loading', f, e.stack.split('\n').slice(0, 4).join('\n')); throw e; }
  }
  return sandbox;
}
function scriptsFromIndex(filter) {
  const html = fs.readFileSync(path.join(WWW, 'index.html'), 'utf8');
  const re = /<script src="([^"]+)"/g; const out = []; let m;
  while ((m = re.exec(html))) if (!filter || filter(m[1])) out.push(m[1]);
  return out;
}
module.exports = { loadFiles, scriptsFromIndex, WWW };
