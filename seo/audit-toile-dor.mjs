// Spider Engine / Attila: static SEO web audit. Run: node seo/audit-toile-dor.mjs
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const cfg=JSON.parse(readFileSync(resolve(root,'seo/spider-engine-toile-dor.json'),'utf8'));
const checks=[];
const check=(name,ok,detail)=>checks.push({name,ok,detail});
for(const w of cfg.webs){
 for(const kind of ['article','product']){
  const file=resolve(root,w[kind]); const exists=existsSync(file);check(w.id+':'+kind+':exists',exists,w[kind]);if(!exists)continue;
  const html=readFileSync(file,'utf8');
  check(w.id+':'+kind+':title',/<title>[^<]+<\/title>/i.test(html),w[kind]);
  check(w.id+':'+kind+':indexable',!/noindex/i.test(html),w[kind]);
  check(w.id+':'+kind+':description',/<meta\s+name=["']description["']/i.test(html),w[kind]);
  check(w.id+':'+kind+':vinted_link',/href=["']https:\/\/(?:www\.)?vinted\.fr\//i.test(html),w[kind]);
  check(w.id+':'+kind+':tracker',html.includes('id="toile-dor-analytics"'),w[kind]);
 }
 const article=resolve(root,w.article);
 if(existsSync(article))check(w.id+':article_to_product',readFileSync(article,'utf8').includes(w.product),w.article);
}
const sitemap=readFileSync(resolve(root,'sitemap.xml'),'utf8');
for(const w of cfg.webs)for(const p of [w.article,w.product])check('sitemap:'+p,sitemap.includes('/'+p),p);
const report={schema:'spider-engine/seo-audit-v1',project:cfg.project,checkedAt:new Date().toISOString(),total:checks.length,passed:checks.filter(x=>x.ok).length,failed:checks.filter(x=>!x.ok),checks};
writeFileSync(resolve(root,'seo/audit-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({total:report.total,passed:report.passed,failed:report.failed},null,2));
if(report.failed.length)process.exitCode=1;
