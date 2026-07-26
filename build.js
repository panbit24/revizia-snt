/*
 * Собирает однофайловую версию игры: index.html в корне репозитория.
 * Исходники живут в src/ раздельно — движок отдельно, сюжеты отдельно.
 * Запуск: node build.js
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'src');
const CONTENT = process.argv[2] || 'content-18.js';   // node build.js content.js — приличная версия

const html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
const content = fs.readFileSync(path.join(SRC, CONTENT), 'utf8');

const style = html.match(/<style>[\s\S]*?<\/style>/);
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
if (!style || !scripts.length) throw new Error('не нашёл <style> или <script> в src/index.html');
const engine = scripts[scripts.length - 1][1];

const title = (content.match(/title:\s*'([^']+)'/) || [, 'ИГРА'])[1];

const out = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>%F0%9F%93%8C</text></svg>">
${style[0]}
</head>
<body>
<div id="app"></div>
<script>
${content}
</${'script'}>
<script>
${engine}
</${'script'}>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), out);
console.log(`index.html собран из src/${CONTENT} — ${Math.round(out.length / 1024)} KB`);
