// Builds a single self-contained HTML page (CSS + JS inlined) for publishing
// as a Claude Artifact. Run: npm run build:artifact
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const dist = 'dist-artifact';
const assets = join(dist, 'assets');
const files = readdirSync(assets);
const css = files.filter((f) => f.endsWith('.css')).map((f) => readFileSync(join(assets, f), 'utf8')).join('\n');
const js = files
  .filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync(join(assets, f), 'utf8'))
  .join('\n')
  .replace(/<\/script/gi, '<\\/script');

// The Artifact host adds the doctype/html/head/body skeleton itself.
const page = `<title>NutriFit</title>
<meta name="description" content="Personalised diet charts, workouts and daily tracking for healthy weight loss.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<style>
${css}
</style>
<div id="root"></div>
<script type="module">
${js}
</script>
`;

mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, 'nutrifit.html'), page);
console.log(`Wrote ${dist}/nutrifit.html (${(page.length / 1024).toFixed(0)} KB)`);
