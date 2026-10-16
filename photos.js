// Guest photo upload: each file is sent (base64) to the Apps Script web app, which saves it into a Drive folder.
// Reached from the QR code on the tables (qr-photos.html → ?page=photos).
const PHOTO_MAX_MB=30;
function readBase64(file){
  return new Promise((ok,ko)=>{const fr=new FileReader();fr.onload=()=>ok(String(fr.result).split(',')[1]);fr.onerror=()=>ko(fr.error);fr.readAsDataURL(file);});
}
async function sendPhoto(file,guest,lang){
  const body=JSON.stringify({type:'photo',name:file.name||'photo.jpg',mime:file.type,guest,lang,data:await readBase64(file)});
  if(!window.RSVP_ENDPOINT){console.warn('Photo demo mode — set window.RSVP_ENDPOINT in config.js',file.name);await new Promise(r=>setTimeout(r,600));return;}
  const res=await fetch(window.RSVP_ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body});
  const out=await res.json();
  if(!out.ok) throw new Error(out.error||'upload failed');
}
function Photos({t,lang}){
  const p=t.photos;const mob=useIsMobile();
  const [guest,setGuest]=React.useState(()=>{try{return localStorage.getItem('lh-guest')||''}catch(e){return ''}});
  const [items,setItems]=React.useState([]);
  const input=React.useRef(null);
  const busy=items.some(i=>i.status==='sending'||i.status==='waiting');
  const done=items.filter(i=>i.status==='done').length;
  const patch=(id,v)=>setItems(l=>l.map(i=>i.id===id?{...i,...v}:i));
  async function run(list){
    // Two uploads at a time: fast enough on mobile data without saturating it.
    const queue=[...list];
    const worker=async()=>{for(let it;(it=queue.shift());){
      patch(it.id,{status:'sending'});
      try{await sendPhoto(it.file,guest.trim(),lang);patch(it.id,{status:'done'});}
      catch(err){console.error(err);patch(it.id,{status:'error'});}
    }};
    await Promise.all([worker(),worker()]);
  }
  function pick(e){
    const files=[...e.target.files];e.target.value='';
    if(!files.length) return;
    try{localStorage.setItem('lh-guest',guest.trim())}catch(err){}
    const list=files.map((file,k)=>({id:Date.now()+'-'+k,file,url:file.type.startsWith('image/')?URL.createObjectURL(file):'',status:file.size>PHOTO_MAX_MB*1048576?'tooBig':'waiting'}));
    setItems(l=>[...list,...l]);
    run(list.filter(i=>i.status==='waiting'));
  }
  const retry=()=>{const failed=items.filter(i=>i.status==='error');failed.forEach(i=>patch(i.id,{status:'waiting'}));run(failed);};
  const badge={sending:['var(--marigold-500)','…'],waiting:['var(--taupe)','…'],done:['var(--jade-500)','✓'],error:['var(--lacquer-500)','!'],tooBig:['var(--lacquer-500)','!']};
  return <main style={{background:'var(--blush)',padding:mob?'48px 12px 64px':'80px 24px 96px',minHeight:'60vh'}}>
    <SectionHeading eyebrow={p.eyebrow} title={p.title}/>
    <p style={{maxWidth:520,margin:'20px auto 0',textAlign:'center',font:'italic '+(mob?17:19)+'px/1.5 var(--font-serif)',color:'var(--text-muted)'}}>{p.intro}</p>
    <div style={{maxWidth:560,margin:(mob?28:40)+'px auto 0',background:'var(--surface-card)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-paper)',padding:mob?'24px 18px':'36px 32px',display:'grid',gap:22}}>
      <TextField label={p.name} placeholder={p.optional} value={guest} onChange={e=>setGuest(e.target.value)}/>
      <input ref={input} type="file" accept="image/*,video/*" multiple onChange={pick} style={{display:'none'}}/>
      <Button size="lg" fullWidth onClick={()=>input.current.click()}>{p.pick}</Button>
      <div style={{font:'400 14px/1.5 var(--font-sans)',color:'var(--text-muted)',textAlign:'center',marginTop:-10}}>{p.hint(PHOTO_MAX_MB)}</div>
      {items.length>0&&<div aria-live="polite" style={{font:'600 13px var(--font-sans)',letterSpacing:'.04em',textAlign:'center',color:busy?'var(--text-muted)':'var(--success)'}}>
        {busy?p.sending(done,items.length):p.done(done)}
      </div>}
      {items.some(i=>i.status==='error')&&!busy&&<div style={{display:'grid',gap:10,justifyItems:'center',textAlign:'center'}}>
        <span style={{font:'400 15px var(--font-sans)',color:'var(--danger)'}}>{p.err}</span>
        <Button variant="secondary" size="sm" onClick={retry}>{p.retry}</Button>
      </div>}
      {items.some(i=>i.status==='tooBig')&&<div style={{font:'400 15px var(--font-sans)',color:'var(--danger)',textAlign:'center'}}>{p.tooBig(PHOTO_MAX_MB)}</div>}
      {items.length>0&&<ul style={{listStyle:'none',margin:0,padding:0,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax('+(mob?84:100)+'px,1fr))',gap:8}}>
        {items.map(i=>{const [c,s]=badge[i.status];return <li key={i.id} style={{position:'relative',aspectRatio:'1',borderRadius:'var(--radius-sm)',overflow:'hidden',background:'var(--paper-2)'}}>
          {i.url?<img src={i.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover',display:'block',opacity:i.status==='done'?1:.55}}/>
            :<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',padding:6,font:'500 11px var(--font-sans)',color:'var(--cocoa)',wordBreak:'break-all',textAlign:'center'}}>{i.file.name}</div>}
          <span style={{position:'absolute',right:6,bottom:6,width:24,height:24,borderRadius:'50%',background:c,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',font:'700 13px var(--font-sans)'}}>{s}</span>
        </li>;})}
      </ul>}
    </div>
  </main>;
}
window.Photos=Photos;
