// Guest photo upload + latest uploads. Each file is sent (base64) to the Apps Script web app, which saves it into
// a Drive folder; GET ?action=recent returns the latest groups (one group = one selection by a guest).
// Reached from the QR code on the tables (qr-photos.html → ?page=photos).
const PHOTO_MAX_MB=30;
// Photos are resized on the phone before upload (about 8 MB → 1 MB): much faster on the venue's mobile data.
const PHOTO_MAX_PX=3000,PHOTO_QUALITY=.88;
const driveThumb=(id,w)=>'https://drive.google.com/thumbnail?id='+id+'&sz=w'+w;
const AVATAR_HUES=['lotus','marigold','jade','hibiscus','terracotta','lacquer'];
function readBase64(file){
  return new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>ok(String(fr.result).split(',')[1]);fr.onerror=()=>ko(fr.error);fr.readAsDataURL(file);});
}
// JPEG/PNG/WebP only; anything the browser can't decode (HEIC outside Safari) or videos are sent as they are.
async function shrinkPhoto(file){
  if(!/^image\/(jpeg|png|webp)$/.test(file.type)||!window.createImageBitmap) return file;
  try{
    const bmp=await createImageBitmap(file);
    const scale=Math.min(1,PHOTO_MAX_PX/Math.max(bmp.width,bmp.height));
    if(scale===1&&file.size<1.5e6){bmp.close();return file;}
    const c=document.createElement('canvas');c.width=Math.round(bmp.width*scale);c.height=Math.round(bmp.height*scale);
    const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(bmp,0,0,c.width,c.height);bmp.close();
    const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',PHOTO_QUALITY));
    if(!blob||blob.size>=file.size) return file;
    return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});
  }catch(err){console.warn('resize skipped',err);return file;}
}
async function sendPhoto(file,guest,lang,batch){
  file=await shrinkPhoto(file);
  const body=JSON.stringify({type:'photo',name:file.name||'photo.jpg',mime:file.type,guest,lang,batch,data:await readBase64(file)});
  if(!window.RSVP_ENDPOINT){console.warn('Photo demo mode — set window.RSVP_ENDPOINT in config.js',file.name);await new Promise(r=>setTimeout(r,600));return 'demo-'+Math.random();}
  const res=await fetch(window.RSVP_ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body});
  const out=await res.json();
  if(!out.ok) throw new Error(out.error||'upload failed');
  return out.id;
}
async function fetchRecent(){
  if(!window.RSVP_ENDPOINT) return [];
  const res=await fetch(window.RSVP_ENDPOINT+'?action=recent');
  const out=await res.json();
  return out.groups||[];
}
function timeAgo(t,lang,justNow){
  const s=Math.round((t-Date.now())/1000),a=Math.abs(s);
  if(a<60) return justNow;
  const rtf=new Intl.RelativeTimeFormat(lang,{numeric:'auto'});
  if(a<3600) return rtf.format(Math.round(s/60),'minute');
  if(a<86400) return rtf.format(Math.round(s/3600),'hour');
  return rtf.format(Math.round(s/86400),'day');
}
const PHOTO_CSS=`
.lhp-drop{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:grid;justify-items:center;gap:10px;padding:32px 20px;text-align:center;border-radius:var(--radius-md);border:2px dashed var(--sand);background:var(--paper);transition:border-color var(--dur-fast),background var(--dur-fast),transform var(--dur-fast) var(--ease-out)}
.lhp-drop:hover,.lhp-drop.drag{border-color:var(--accent-primary);background:var(--lacquer-50)}
.lhp-drop:disabled{cursor:default;opacity:.55}
.lhp-drop:active{transform:scale(.99)}
.lhp-drop:focus-visible{outline:2px solid var(--focus-ring);outline-offset:4px}
.lhp-drop-icon{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--accent-primary);color:var(--paper);box-shadow:var(--shadow-lift);transition:transform var(--dur-base) var(--ease-bloom)}
.lhp-drop:hover .lhp-drop-icon,.lhp-drop.drag .lhp-drop-icon{transform:translateY(-3px) scale(1.05)}
.lhp-bar{height:6px;border-radius:999px;background:var(--paper-2);overflow:hidden}
.lhp-bar>span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--marigold-500),var(--lacquer-500));transition:width .4s var(--ease-out)}
.lhp-grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px}
.lhp-tile{position:relative;aspect-ratio:1;border-radius:10px;overflow:hidden;background:var(--paper-2)}
.lhp-tile img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity var(--dur-base),transform var(--dur-slow) var(--ease-out)}
.lhp-tile.pending img{opacity:.5}
.lhp-badge{position:absolute;right:6px;bottom:6px;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font:700 13px var(--font-sans);box-shadow:0 2px 6px rgba(0,0,0,.25)}
.lhp-x{all:unset;position:absolute;top:4px;right:4px;width:28px;height:28px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;background:rgba(36,16,30,.65);color:#fff;font:400 20px/1 var(--font-sans);transition:background var(--dur-fast)}
.lhp-x:hover{background:var(--lacquer-500)}.lhp-x:focus-visible{outline:2px solid var(--focus-ring)}
.lhp-spin{position:absolute;inset:0;margin:auto;width:28px;height:28px;border-radius:50%;border:3px solid rgba(255,255,255,.6);border-top-color:var(--accent-primary);animation:lhpspin .8s linear infinite}
@keyframes lhpspin{to{transform:rotate(360deg)}}
.lhp-pop{animation:lhppop .45s var(--ease-bloom)}
@keyframes lhppop{from{transform:scale(.4);opacity:0}}
.lhp-groups{display:grid;gap:16px;align-items:start;grid-template-columns:repeat(auto-fill,minmax(min(320px,100%),1fr))}
.lhp-group{background:var(--surface-card);border-radius:var(--radius-lg);box-shadow:var(--shadow-paper);padding:18px;display:grid;gap:14px;align-content:start;animation:lhpfade .5s var(--ease-out) both}
@keyframes lhpfade{from{opacity:0;transform:translateY(12px)}}
.lhp-mosaic{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.lhp-mosaic.n1{grid-template-columns:1fr}.lhp-mosaic.n2,.lhp-mosaic.n4{grid-template-columns:repeat(2,1fr)}
.lhp-mosaic.n1 .lhp-thumb{aspect-ratio:4/3}
.lhp-thumb{all:unset;box-sizing:border-box;position:relative;aspect-ratio:1;border-radius:10px;overflow:hidden;cursor:zoom-in;background:var(--paper-2)}
.lhp-thumb:focus-visible{outline:2px solid var(--focus-ring);outline-offset:2px}
.lhp-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform var(--dur-slow) var(--ease-out)}
.lhp-thumb:hover img{transform:scale(1.06)}
.lhp-more{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(36,16,30,.55);color:#fff;font:600 22px var(--font-sans)}
.lhp-play{position:absolute;inset:0;margin:auto;width:40px;height:40px;border-radius:50%;background:rgba(36,16,30,.6);display:flex;align-items:center;justify-content:center}
.lhp-skel{background:linear-gradient(90deg,var(--paper-2) 0%,var(--cream) 50%,var(--paper-2) 100%);background-size:200% 100%;animation:lhpskel 1.2s ease-in-out infinite}
@keyframes lhpskel{to{background-position:-200% 0}}
.lhp-box{position:fixed;inset:0;z-index:100;background:rgba(20,8,16,.96);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;animation:lhpbox .2s ease both;touch-action:pan-y}
@keyframes lhpbox{from{opacity:0}}
.lhp-box img,.lhp-box iframe{max-width:min(94vw,1400px);max-height:84vh;border-radius:8px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.lhp-box iframe{width:min(94vw,960px);aspect-ratio:16/9;border:0;background:#000}
.lhp-nav{all:unset;position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12);color:#fff;font:400 26px/1 var(--font-sans);transition:background var(--dur-fast)}
.lhp-nav:hover{background:rgba(255,255,255,.25)}.lhp-nav:focus-visible{outline:2px solid var(--focus-ring)}
@media (max-width:640px){.lhp-nav.side{display:none}.lhp-drop{padding:26px 16px}}
@media (prefers-reduced-motion:reduce){.lhp-group,.lhp-pop,.lhp-box{animation:none}.lhp-thumb:hover img{transform:none}}`;
function Icon({d,size=24}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;}
const ICON_UPLOAD=<><path d="M12 16V4"/><path d="m6 10 6-6 6 6"/><path d="M4 20h16"/></>;
const ICON_PLUS=<><path d="M12 5v14"/><path d="M5 12h14"/></>;
const ICON_PLAY=<path d="M8 5v14l11-7z" fill="#fff" stroke="none"/>;
function Photos({t,lang}){
  const p=t.photos;const mob=useIsMobile();
  const [guest,setGuest]=React.useState(()=>{try{return localStorage.getItem('lh-guest')||''}catch(e){return ''}});
  const [items,setItems]=React.useState([]);
  const [drag,setDrag]=React.useState(false);
  const [recent,setRecent]=React.useState(null);
  const [recentErr,setRecentErr]=React.useState(false);
  const [box,setBox]=React.useState(null);
  const input=React.useRef(null);
  // Drive thumbnails take a few seconds to exist: photos sent from this phone are shown from the local copy.
  const local=React.useRef({});
  const load=React.useCallback(()=>fetchRecent().then(g=>{setRecent(g);setRecentErr(false)}).catch(err=>{console.error(err);setRecentErr(true);setRecent(r=>r||[])}),[]);
  React.useEffect(()=>{load();const h=setInterval(()=>document.visibilityState==='visible'&&load(),60000);return()=>clearInterval(h)},[load]);
  const busy=items.some(i=>i.status==='sending'||i.status==='waiting');
  const staged=items.filter(i=>i.status==='staged').length;
  const sendable=items.filter(i=>i.status!=='tooBig'&&i.status!=='staged');
  const done=items.filter(i=>i.status==='done').length;
  const failed=items.filter(i=>i.status==='error').length;
  const patch=(id,v)=>setItems(l=>l.map(i=>i.id===id?{...i,...v}:i));
  async function run(list){
    // Three uploads at a time: fast on mobile data without saturating it.
    const queue=[...list];
    const worker=async()=>{for(let it;(it=queue.shift());){
      patch(it.id,{status:'sending'});
      try{const id=await sendPhoto(it.file,guest.trim(),lang,it.batch);if(it.url)local.current[id]=it.url;patch(it.id,{status:'done'});}
      catch(err){console.error(err);patch(it.id,{status:'error'});}
    }};
    await Promise.all([worker(),worker(),worker()]);
    load();
  }
  // Photos are first staged (the guest can add several times and remove some), then sent together as one group.
  function add(files){
    files=files.filter(f=>/^(image|video)\//.test(f.type)||/\.(heic|heif)$/i.test(f.name));
    if(!files.length||busy) return;
    const key=Date.now().toString(36);
    const list=files.map((file,k)=>({id:key+'-'+k,file,url:file.type.startsWith('image/')?URL.createObjectURL(file):'',status:file.size>PHOTO_MAX_MB*1048576?'tooBig':'staged'}));
    // A new selection after a finished send starts a new group.
    setItems(l=>[...l.filter(i=>i.status!=='done'),...list]);
  }
  function remove(id){setItems(l=>l.filter(i=>{if(i.id===id&&i.url)URL.revokeObjectURL(i.url);return i.id!==id;}));}
  function send(){
    try{localStorage.setItem('lh-guest',guest.trim())}catch(err){}
    const batch=Date.now().toString(36)+Math.random().toString(36).slice(2,6);
    const list=items.filter(i=>i.status==='staged'||i.status==='error').map(i=>({...i,batch,status:'waiting'}));
    setItems(l=>l.map(i=>list.find(x=>x.id===i.id)||i));
    run(list);
  }
  const retry=()=>{const f=items.filter(i=>i.status==='error');f.forEach(i=>patch(i.id,{status:'waiting'}));run(f);};
  const reset=()=>setItems([]);
  const onDrop=e=>{e.preventDefault();setDrag(false);add([...e.dataTransfer.files]);};
  const badge={done:['var(--jade-500)','✓'],error:['var(--lacquer-500)','!'],tooBig:['var(--lacquer-500)','!']};
  const label={font:'600 12px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:'var(--accent-primary)'};
  const sent=sendable.length>0;
  return <main style={{background:'var(--blush)',padding:mob?'40px 12px 64px':'72px 24px 96px'}}>
    <style>{PHOTO_CSS}</style>
    <SectionHeading eyebrow={p.eyebrow} title={p.title}/>
    <p style={{maxWidth:520,margin:'16px auto 0',textAlign:'center',font:'italic '+(mob?17:19)+'px/1.5 var(--font-serif)',color:'var(--text-muted)',textWrap:'balance'}}>{p.intro}</p>

    <section style={{maxWidth:600,margin:(mob?24:36)+'px auto 0',background:'var(--surface-card)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-paper)',padding:mob?'20px 16px':'32px',display:'grid',gap:20}}>
      <TextField label={p.name} placeholder={p.optional} value={guest} onChange={e=>setGuest(e.target.value)}/>
      <input ref={input} type="file" accept="image/*,video/*" multiple onChange={e=>{add([...e.target.files]);e.target.value='';}} style={{display:'none'}}/>
      <button type="button" disabled={busy} className={'lhp-drop'+(drag?' drag':'')} onClick={()=>input.current.click()}
        onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={onDrop}>
        <span className="lhp-drop-icon"><Icon d={staged?ICON_PLUS:ICON_UPLOAD} size={28}/></span>
        <span style={{font:'600 15px var(--font-sans)',letterSpacing:'.12em',textTransform:'uppercase',color:'var(--text-strong)'}}>{staged?p.pickMore:p.pick}</span>
        {!mob&&<span style={{font:'italic 16px var(--font-serif)',color:'var(--text-muted)'}}>{p.drop}</span>}
        <span style={{font:'400 13px var(--font-sans)',color:'var(--text-muted)'}}>{p.hint(PHOTO_MAX_MB)}</span>
      </button>

      {items.length>0&&<div style={{display:'grid',gap:14}}>
        <div aria-live="polite" style={{display:'grid',gap:8}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:12,font:'600 14px var(--font-sans)',color:'var(--text-strong)'}}>
            <span>{busy?p.sending:staged?p.ready(staged):failed?p.someFailed(failed):sent?p.doneTitle(done):p.tooBig(PHOTO_MAX_MB)}</span>
            {sent&&<span style={{color:'var(--text-muted)',fontWeight:500,whiteSpace:'nowrap'}}>{done} / {sendable.length}</span>}
          </div>
          {sent&&<div className="lhp-bar"><span style={{width:done/sendable.length*100+'%'}}/></div>}
        </div>
        <ul className="lhp-grid">
          {items.map(i=>{const b=badge[i.status];return <li key={i.id} className={'lhp-tile lhp-pop'+(i.status==='done'||i.status==='staged'?'':' pending')}>
            {i.url?<img src={i.url} alt="" onError={e=>{e.currentTarget.style.display='none'}}/>
              :<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',padding:6,font:'500 11px var(--font-sans)',color:'var(--cocoa)',wordBreak:'break-all',textAlign:'center'}}>{i.file.name}</div>}
            {(i.status==='sending'||i.status==='waiting')&&<span className="lhp-spin" style={i.status==='waiting'?{animationPlayState:'paused',opacity:.5}:null}/>}
            {b&&<span className="lhp-badge lhp-pop" style={{background:b[0]}}>{b[1]}</span>}
            {(i.status==='staged'||i.status==='tooBig')&&<button type="button" className="lhp-x" aria-label={p.remove} onClick={()=>remove(i.id)}>×</button>}
          </li>;})}
        </ul>
        {staged>0&&items.some(i=>i.status==='tooBig')&&<div style={{font:'400 14px/1.5 var(--font-sans)',color:'var(--danger)'}}>{p.tooBig(PHOTO_MAX_MB)}</div>}
        {/* Sticky so the send button stays in reach on a phone while photos are added. */}
        {staged>0&&!busy&&<div style={{position:'sticky',bottom:12,zIndex:2,borderRadius:'var(--radius-pill)',boxShadow:'var(--shadow-lift)'}}><Button size="lg" fullWidth onClick={send}>{p.send(staged)}</Button></div>}
        {!busy&&!staged&&failed>0&&<div style={{display:'grid',gap:10,justifyItems:'center',textAlign:'center'}}>
          <span style={{font:'400 14px/1.5 var(--font-sans)',color:'var(--danger)'}}>{p.err}</span>
          <Button size="sm" onClick={retry}>{p.retry}</Button>
        </div>}
        {!busy&&!staged&&!failed&&done>0&&<div style={{display:'flex',justifyContent:'center'}}><Button variant="secondary" size="sm" onClick={reset}>{p.clear}</Button></div>}
      </div>}
    </section>

    <section style={{maxWidth:'var(--content-max)',margin:(mob?48:72)+'px auto 0',display:'grid',gap:mob?20:28}}>
      <div style={{display:'grid',gap:8,justifyItems:'center',textAlign:'center'}}>
        <span style={label}>{p.recentEyebrow}</span>
        <h3 style={{margin:0,font:'var(--fs-display-sm)/1.2 var(--font-display)',color:'var(--text-strong)'}}>{p.recentTitle}</h3>
      </div>
      {recent===null?<div className="lhp-groups">{[0,1,2].map(k=><div key={k} className="lhp-group"><div style={{display:'flex',gap:12,alignItems:'center'}}><div className="lhp-skel" style={{width:40,height:40,borderRadius:'50%'}}/><div className="lhp-skel" style={{height:14,width:'50%',borderRadius:6}}/></div><div className="lhp-mosaic">{[0,1,2].map(j=><div key={j} className="lhp-skel" style={{aspectRatio:'1',borderRadius:10}}/>)}</div></div>)}</div>
      :recent.length===0?<p style={{margin:0,textAlign:'center',font:'italic 17px/1.5 var(--font-serif)',color:'var(--text-muted)'}}>{recentErr?p.recentErr:p.empty}</p>
      :<div className="lhp-groups">{recent.map((g,gi)=><Group key={g.files[0].id} g={g} gi={gi} p={p} lang={lang} local={local.current} open={i=>setBox({files:g.files,i})}/>)}</div>}
    </section>
    {box&&<Lightbox files={box.files} i={box.i} setI={i=>setBox(b=>({...b,i}))} onClose={()=>setBox(null)} p={p} local={local.current}/>}
  </main>;
}
function Group({g,gi,p,lang,local,open}){
  const n=g.files.length,shown=g.files.slice(0,6),extra=n-shown.length;
  const name=g.guest||p.anon;
  const hue=AVATAR_HUES[[...name].reduce((a,c)=>a+c.charCodeAt(0),0)%AVATAR_HUES.length];
  return <article className="lhp-group" style={{animationDelay:gi*60+'ms'}}>
    <header style={{display:'flex',alignItems:'center',gap:12}}>
      <span aria-hidden="true" style={{flex:'none',width:40,height:40,borderRadius:'50%',background:'var(--'+hue+'-500)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',font:'600 16px var(--font-sans)'}}>{[...name.trim()][0].toUpperCase()}</span>
      <div style={{display:'grid',minWidth:0}}>
        <span style={{font:'20px/1.25 var(--font-display)',color:'var(--text-strong)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{name}</span>
        <span style={{font:'500 13px var(--font-sans)',color:'var(--text-muted)'}}>{timeAgo(g.t,lang,p.justNow)} · {p.count(n)}</span>
      </div>
    </header>
    <div className={'lhp-mosaic n'+Math.min(shown.length,6)}>
      {shown.map((f,i)=><button key={f.id} type="button" className="lhp-thumb" aria-label={p.view(i+1,n)} onClick={()=>open(i)}>
        <Thumb f={f} w={shown.length===1?800:400} local={local}/>
        {f.v?<span className="lhp-play"><Icon d={ICON_PLAY} size={18}/></span>:null}
        {i===shown.length-1&&extra>0&&<span className="lhp-more">+{extra}</span>}
      </button>)}
    </div>
  </article>;
}
// Drive thumbnail, or the local copy for photos sent from this phone; a soft placeholder while Drive prepares it.
function Thumb({f,w,local}){
  const [bad,setBad]=React.useState(false);
  const src=local[f.id]||driveThumb(f.id,w);
  if(bad) return <div className="lhp-skel" style={{width:'100%',height:'100%'}}/>;
  return <img src={src} alt="" loading="lazy" onError={()=>setBad(true)}/>;
}
function Lightbox({files,i,setI,onClose,p,local}){
  const n=files.length,f=files[i];
  const go=d=>setI((i+d+n)%n);
  const touch=React.useRef(null);
  React.useEffect(()=>{
    const k=e=>{if(e.key==='Escape')onClose();if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);};
    window.addEventListener('keydown',k);const o=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{window.removeEventListener('keydown',k);document.body.style.overflow=o;};
  });
  const stop=e=>e.stopPropagation();
  return <div className="lhp-box" role="dialog" aria-modal="true" aria-label={p.view(i+1,n)} onClick={onClose}
    onTouchStart={e=>{touch.current=e.touches[0].clientX}} onTouchEnd={e=>{const dx=e.changedTouches[0].clientX-(touch.current??0);if(Math.abs(dx)>50&&n>1)go(dx<0?1:-1);}}>
    {f.v?<iframe key={f.id} src={'https://drive.google.com/file/d/'+f.id+'/preview'} allow="autoplay; fullscreen" onClick={stop} title={p.view(i+1,n)}/>
      :<img key={f.id} src={local[f.id]||driveThumb(f.id,1600)} alt="" onClick={stop}/>}
    <button type="button" className="lhp-nav" aria-label={p.close} onClick={onClose} style={{top:16,right:16,transform:'none'}}>×</button>
    {n>1&&<><button type="button" className="lhp-nav side" aria-label={p.prev} onClick={e=>{stop(e);go(-1)}} style={{left:16}}>‹</button>
      <button type="button" className="lhp-nav side" aria-label={p.next} onClick={e=>{stop(e);go(1)}} style={{right:16}}>›</button></>}
    <div style={{position:'absolute',bottom:18,left:0,right:0,textAlign:'center',font:'500 13px var(--font-sans)',letterSpacing:'.1em',color:'rgba(255,255,255,.75)'}}>{i+1} / {n}</div>
  </div>;
}
window.Photos=Photos;
