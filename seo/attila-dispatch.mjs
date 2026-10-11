// Spider Engine — Attila task dispatcher (Node >=18). No hidden network activity.
import {readFileSync,existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(readFileSync(resolve(root,'seo/spider-engine-toile-dor.json'),'utf8'));
const agents={
 'neo-attila-seo':{tasks:['seo-audit'],role:'Check search readiness'},
 'neo-attila-editorial':{tasks:['content-inventory'],role:'Inventory article-to-product webs'},
 'mini-attila-recovery':{tasks:['file-recovery-check'],role:'Identify missing files, no silent restoration'},
 'micro-attila-integrity':{tasks:['link-integrity'],role:'Check local internal links'}
};
function run(agent,task){
 if(!agents[agent]||!agents[agent].tasks.includes(task))throw Error('Unauthorized agent/task');
 const checks=[];
 const add=(item,ok,detail)=>checks.push({item,ok,detail});
 for(const web of config.webs){
  const article=resolve(root,web.article),product=resolve(root,web.product);
  if(task==='file-recovery-check'){add(web.article,existsSync(article),'file present');add(web.product,existsSync(product),'file present');}
  if(task==='content-inventory'){add(web.id,existsSync(article)&&existsSync(product),'article and product present');}
  if(task==='link-integrity'&&existsSync(article))add(web.id,readFileSync(article,'utf8').includes(web.product),'article links to product');
  if(task==='seo-audit')for(const path of [web.article,web.product]){
   const file=resolve(root,path),html=existsSync(file)?readFileSync(file,'utf8'):'';
   add(path+':exists',!!html,'file present');
   add(path+':indexable',!!html&&!/noindex/i.test(html),'no noindex');
   add(path+':title',/<title>[^<]+<\/title>/i.test(html),'HTML title');
  }
 }
 const result={run_id:randomUUID(),at:new Date().toISOString(),agent,task,project:'toile-dor',passed:checks.filter(x=>x.ok).length,failed:checks.filter(x=>!x.ok).length,checks,mode:'local-static-audit',sales_attribution:'not-connected'};
 mkdirSync(resolve(root,'seo/reports'),{recursive:true});
 const dest=resolve(root,'seo/reports/last-'+agent+'.json');
 writeFileSync(dest,JSON.stringify(result,null,2)+'\n');
 return {result,report:dest};
}
const [agent,task]=process.argv.slice(2);
if(!agent||!task){console.error('Usage: node seo/attila-dispatch.mjs <agent> <task>');process.exit(2);}
try{const {result,report}=run(agent,task);console.log(JSON.stringify({agent,task,passed:result.passed,failed:result.failed,report}));if(result.failed)process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=2;}
