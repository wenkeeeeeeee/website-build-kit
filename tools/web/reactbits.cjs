#!/usr/bin/env node
// React Bits (https://reactbits.dev) component source, fetched on demand.
//
// React Bits is MIT + Commons Clause: its components may be used inside a client's website, but not redistributed
// on their own or in a bundle. So the kit never stores them: this script keeps a git-ignored copy of the repo in
// tools/web/.cache/react-bits and copies single components into a project when asked.
//
// The components are React (JSX + CSS). Our sites have no build step, so port the one you pick to plain JS:
// keep the shader / canvas / GSAP code, turn the useEffect body into an init(el, options) function that returns a
// destroy(), replace motion/react with GSAP, and load ogl / three / gsap from site/js/vendor/. Keep the license
// header the script writes at the top of the ported file.
//
//   node tools/web/reactbits.cjs list                 every component, grouped, with the libraries it needs
//   node tools/web/reactbits.cjs list aurora          filter by name or category
//   node tools/web/reactbits.cjs get Aurora --out <site>/js/reactbits
//   node tools/web/reactbits.cjs update               pull the latest components
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = 'https://github.com/DavidHDev/react-bits.git';
const CACHE = path.join(__dirname, '.cache', 'react-bits');
const CONTENT = path.join(CACHE, 'src', 'content');

function git(args, opts = {}) {
  return execFileSync('git', args, { stdio: opts.quiet ? 'pipe' : 'inherit', encoding: 'utf8' });
}

function ensureCache() {
  if (fs.existsSync(CONTENT)) return;
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  console.error('Fetching React Bits into ' + CACHE + ' ...');
  git(['clone', '--depth', '1', '--filter=blob:none', '--sparse', '-q', REPO, CACHE]);
  git(['-C', CACHE, 'sparse-checkout', 'set', 'src/content']);
}

function components() {
  ensureCache();
  const out = [];
  for (const cat of fs.readdirSync(CONTENT).sort()) {
    const catDir = path.join(CONTENT, cat);
    if (!fs.statSync(catDir).isDirectory()) continue;
    for (const name of fs.readdirSync(catDir).sort()) {
      const dir = path.join(catDir, name);
      if (fs.statSync(dir).isDirectory()) out.push({ cat, name, dir });
    }
  }
  return out;
}

function deps(dir) {
  const found = new Set();
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(jsx?|tsx?)$/.test(f)) continue;
    const src = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of src.matchAll(/from\s+['"]([^'".][^'"]*)['"]/g)) {
      const pkg = m[1].startsWith('@') ? m[1].split('/').slice(0, 2).join('/') : m[1].split('/')[0];
      if (!['react', 'react-dom'].includes(pkg)) found.add(pkg);
    }
  }
  return [...found];
}

function header(c, commit) {
  return [
    `/*`,
    ` * Based on React Bits "${c.name}" (${c.cat}) by David Haz, https://reactbits.dev`,
    ` * Source: ${REPO.replace(/\.git$/, '')}/tree/${commit}/src/content/${c.cat}/${c.name}`,
    ` * License: MIT + Commons Clause. Used here as part of this website; not for redistribution on its own.`,
    ` */`,
    ``,
  ].join('\n');
}

const [cmd, ...rest] = process.argv.slice(2);

if (cmd === 'list') {
  const q = (rest[0] || '').toLowerCase();
  let cat = '';
  for (const c of components()) {
    if (q && !c.name.toLowerCase().includes(q) && !c.cat.toLowerCase().includes(q)) continue;
    if (c.cat !== cat) console.log('\n' + (cat = c.cat));
    const d = deps(c.dir);
    console.log('  ' + c.name.padEnd(24) + (d.length ? d.join(', ') : 'no libraries'));
  }
} else if (cmd === 'get') {
  const name = rest.find((a, i) => !a.startsWith('--') && rest[i - 1] !== '--out');
  const oi = rest.indexOf('--out');
  const outRoot = oi >= 0 ? rest[oi + 1] : 'reactbits';
  if (!name) { console.error('Usage: reactbits.cjs get <Name> [--out <dir>]'); process.exit(1); }
  const all = components();
  const c = all.find(x => x.name.toLowerCase() === name.toLowerCase());
  if (!c) {
    const near = all.filter(x => x.name.toLowerCase().includes(name.toLowerCase())).map(x => x.name);
    console.error(`No component "${name}".` + (near.length ? ' Did you mean: ' + near.join(', ') : ' Run "list".'));
    process.exit(1);
  }
  const commit = git(['-C', CACHE, 'rev-parse', '--short', 'HEAD'], { quiet: true }).trim();
  const out = path.resolve(outRoot, c.name);
  fs.mkdirSync(out, { recursive: true });
  for (const f of fs.readdirSync(c.dir)) {
    const src = path.join(c.dir, f);
    if (!fs.statSync(src).isFile()) continue;
    const text = /\.(jsx?|tsx?|css)$/.test(f);
    fs.writeFileSync(path.join(out, f), text ? header(c, commit) + fs.readFileSync(src, 'utf8') : fs.readFileSync(src));
  }
  const d = deps(c.dir);
  console.log(`${c.cat}/${c.name} -> ${out}`);
  console.log('Needs: ' + (d.length ? d.join(', ') : 'nothing beyond the browser'));
  console.log('This is React source: port it to plain JS before use (see this script\'s header) and delete the .jsx.');
} else if (cmd === 'update') {
  ensureCache();
  git(['-C', CACHE, 'fetch', '--depth', '1', '-q', 'origin']);
  git(['-C', CACHE, 'reset', '--hard', '-q', 'FETCH_HEAD']);
  console.log('React Bits now at ' + git(['-C', CACHE, 'rev-parse', '--short', 'HEAD'], { quiet: true }).trim());
} else {
  console.log(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 17).map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
}
