const vm=require('vm'),fs=require('fs');
const root=process.argv[2];
const c={window:{}};vm.createContext(c);
vm.runInContext(fs.readFileSync(root+'/data/rulers.js','utf8'),c);
if(fs.existsSync(root+'/data/glossary.js')) vm.runInContext(fs.readFileSync(root+'/data/glossary.js','utf8'),c);
const SM=c.window.SM; let errs=0;
function chk(name,arr,start,end,roles){
  for(let i=1;i<arr.length;i++) if(arr[i].from<arr[i-1].from){console.log(name,'not sorted at',i);errs++;}
  const main=arr.filter(r=>!r.parallel);
  if(main[0].from>start){console.log(name,'starts late');errs++;}
  if(main[main.length-1].to<end){console.log(name,'ends early');errs++;}
  for(let i=0;i<main.length;i++){const r=main[i];
    if(!(r.to>r.from)){console.log(name,'bad range',r.from,r.to);errs++;}
    if(i&&main[i-1].to!==r.from){console.log(name,'gap/overlap',main[i-1].to,'->',r.from, r.name?r.name.sv:r.status);errs++;}
    if(roles&&!roles.includes(r.role)){console.log(name,'bad role',r.role);errs++;}
    for(const f of ['name','note','house']) if(r[f]) for(const l of ['sv','en','ar']) if(!r[f][l]){console.log(name,'missing',f,l,r.from);errs++;}
  }
  arr.filter(r=>r.parallel).forEach(p=>{ if(!main.some(m=>m.from<p.to&&m.to>p.from)){console.log(name,'parallel without overlap',p.from);errs++;} });
}
const R=['king','queen','union','regent','regency','contested','interregnum'];
chk('rulers',SM.rulers,995,1721,R);
chk('unionStatus',SM.unionStatus,1389,1523,null);
SM.unionStatus.forEach(u=>{if(!['forming','union','breakaway','contested'].includes(u.status)){console.log('bad status',u.status);errs++;}});
chk('danishRulers',SM.danishRulers,1340,1721,R);
if(SM.glossary){const ids=new Set();SM.glossary.forEach(g=>{if(ids.has(g.id)){console.log('dup',g.id);errs++;}ids.add(g.id);
 for(const f of ['term','def'])for(const l of ['sv','en','ar'])if(!g[f]||!g[f][l]){console.log('glossary missing',g.id,f,l);errs++;}
 const w=g.def.en.split(/\s+/).length, ws=g.def.sv.split(/\s+/).length; if(w<25||w>50||ws<22||ws>52) console.log('wordcount',g.id,'sv',ws,'en',w,'ar',g.def.ar.split(/\s+/).length);});}
console.log('rulers',SM.rulers.length,'union',SM.unionStatus.length,'danish',SM.danishRulers.length,'glossary',SM.glossary?SM.glossary.length:0,'errors',errs);
process.exit(errs?1:0);
