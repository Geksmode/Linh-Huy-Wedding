function Rsvp({go,t,lang}){
  const r=t.rsvp;const mob=useIsMobile();
  const [f,setF]=React.useState({name:'',email:'',attending:'y',party:r.partyOpts[0],events:[],note:''});
  const set=k=>v=>setF(p=>({...p,[k]:v&&v.target?v.target.value:v}));
  const [status,setStatus]=React.useState('idle');
  const [nameErr,setNameErr]=React.useState('');
  const yes=f.attending==='y';
  async function submit(e){
    e.preventDefault();
    if(!f.name.trim()){setNameErr(r.nameReq);return;}
    setNameErr('');setStatus('sending');
    const row={timestamp:new Date().toISOString(),name:f.name.trim(),email:f.email.trim(),attending:yes?'yes':'no',partySize:yes?f.party:'',events:yes?f.events.join(', '):'',note:f.note.trim(),lang};
    try{
      if(window.RSVP_ENDPOINT){
        await fetch(window.RSVP_ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(row)});
      }else{console.warn('RSVP demo mode — set window.RSVP_ENDPOINT in config.js',row);}
      setStatus('done');
    }catch(err){console.error(err);setStatus('error');}
  }
  return <main style={{background:'var(--blush)',padding:mob?'48px 12px 64px':'80px 24px 96px'}}>
    <SectionHeading eyebrow={r.eyebrow} title={r.title}/>
    <form onSubmit={submit} style={{maxWidth:560,margin:(mob?28:40)+'px auto 0',background:'var(--surface-card)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-paper)',padding:mob?'24px 18px':'36px 32px',display:'grid',gap:22}}>
      <TextField label={r.name} placeholder="Nguyễn Thị Mai" value={f.name} onChange={set('name')} error={nameErr||undefined}/>
      <TextField label={r.email} type="email" placeholder="mai@example.com" value={f.email} onChange={set('email')}/>
      <ChoiceGroup label={r.attend} options={[{value:'y',label:r.yes},{value:'n',label:r.no}]} value={f.attending} onChange={set('attending')}/>
      {yes&&<>
        <Select label={r.party} options={r.partyOpts} value={f.party} onChange={set('party')}/>
        <ChoiceGroup label={r.events} layout="list" multiple options={r.eventOpts} value={f.events} onChange={set('events')}/>
      </>}
      <TextField label={r.note} multiline rows={3} placeholder={r.optional} value={f.note} onChange={set('note')}/>
      {status==='error'&&<div style={{font:'400 15px var(--font-sans)',color:'var(--danger)'}}>{r.err}</div>}
      <Button type="submit" size="lg" fullWidth disabled={status==='sending'}>{status==='sending'?r.sending:(yes?r.send:r.sendNo)}</Button>
    </form>
    <GiftBox g={r.gift} mob={mob}/>
    <Dialog open={status==='done'} onClose={()=>setStatus('idle')} title={yes?r.gotIt:r.miss}
      actions={<><Button onClick={()=>{setStatus('idle');go('schedule')}}>{r.toSched}</Button><Button variant="secondary" onClick={()=>setStatus('idle')}>{r.close}</Button></>}>
      {yes?r.yesMsg(f.name):r.noMsg}
    </Dialog>
  </main>;
}
window.Rsvp=Rsvp;
// Gift card attached under the form (same card style). Tap / click / Enter: the lid lifts off and the
// QR code unfolds below the open box. Colours from the home page arches.
function GiftBox({g,mob}){
  const [open,setOpen]=React.useState(false);const qr=mob?180:180,pad=mob?14:16;
  return <section style={{maxWidth:560,margin:'16px auto 0',background:'var(--surface-card)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow-paper)',padding:mob?'18px 18px':'24px 32px'}}>
    <style>{`.lh-gift{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:20px;text-align:left}
.lh-gift:focus-visible{outline:2px solid var(--focus-ring);outline-offset:6px;border-radius:12px}
.lh-gift-lid{transform-box:fill-box;transform-origin:0% 100%;transition:transform .6s var(--ease-bloom)}
.lh-gift-svg{transition:transform .3s var(--ease-out)}
.lh-gift:hover .lh-gift-svg{transform:translateY(-3px)}
.lh-gift:not(.open) .lh-gift-svg{animation:lhwiggle 3.2s ease-in-out infinite}
@keyframes lhwiggle{0%,80%,100%{transform:rotate(0)}84%{transform:rotate(-6deg)}88%{transform:rotate(5deg)}92%{transform:rotate(-3deg)}96%{transform:rotate(2deg)}}
.lh-gift.open .lh-gift-lid{transform:translate(-8px,-14px) rotate(-24deg)}
.lh-gift-reveal{display:grid;grid-template-rows:0fr;overflow:hidden;transition:grid-template-rows .6s var(--ease-out)}
.lh-gift-reveal.open{grid-template-rows:1fr}
.lh-gift-qr{opacity:0;transform:translateY(-24px) scale(.6);transition:transform .6s var(--ease-bloom) .1s,opacity .3s ease .1s}
.lh-gift-reveal.open .lh-gift-qr{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.lh-gift:not(.open) .lh-gift-svg{animation:none}}`}</style>
    <button type="button" className={'lh-gift'+(open?' open':'')} aria-expanded={open} aria-controls="lh-gift-qr" onClick={()=>setOpen(o=>!o)}>
      <svg className="lh-gift-svg" width={mob?72:84} height={mob?72:84} viewBox="0 0 100 100" aria-hidden="true" style={{overflow:'visible'}}>
        <rect x="14" y="44" width="72" height="50" rx="8" fill="var(--lotus-500)"/>
        <rect x="44" y="44" width="12" height="50" fill="var(--marigold-500)"/>
        <g className="lh-gift-lid">
          <rect x="8" y="30" width="84" height="16" rx="8" fill="var(--lacquer-500)"/>
          <rect x="44" y="30" width="12" height="16" fill="var(--marigold-500)"/>
          <path d="M50 30C40 10 22 14 32 29Z" fill="var(--marigold-500)"/><path d="M50 30C60 10 78 14 68 29Z" fill="var(--marigold-500)"/>
        </g>
      </svg>
      <span style={{display:'grid',gap:4}}>
        <span style={{font:'600 12px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:'var(--accent-primary)'}}>{g.eyebrow}</span>
        <span style={{font:(mob?22:26)+'px/1.2 var(--font-display)',color:'var(--text-strong)'}}>{g.title}</span>
        <span style={{font:'italic 16px/1.45 var(--font-serif)',color:'var(--text-muted)'}}>{open?g.caption:g.hint}</span>
      </span>
    </button>
    <div id="lh-gift-qr" className={'lh-gift-reveal'+(open?' open':'')} aria-hidden={!open}>
      <div style={{minHeight:0}}>
        <div className="lh-gift-qr" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(200px,100%),1fr))',columnGap:20,rowGap:0,marginTop:20}}>
          {g.people.map(p=><div key={p.name} style={{display:'grid',gridRow:'span 6',gridTemplateRows:'subgrid',alignItems:'center',marginBottom:mob?16:0,justifyItems:'center',rowGap:6,padding:pad,borderRadius:'var(--radius-md)',background:'var(--paper)',boxShadow:'inset 0 0 0 1px var(--sand)',textAlign:'center'}}>
            <span style={{font:'600 11px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:'var(--accent-primary)'}}>{p.role}</span>
            <span style={{font:'20px/1.2 var(--font-display)',color:'var(--text-strong)'}}>{p.name}</span>
            <img src={p.qr} alt={p.alt} width={qr} height={qr} style={{display:'block',objectFit:'contain',margin:'6px 0',background:'#fff',borderRadius:8}}/>
            <span style={{font:'600 13px var(--font-sans)',color:'var(--text-strong)'}}>{p.bank}</span>
            <span style={{font:'500 15px var(--font-sans)',letterSpacing:'.06em',color:'var(--text-strong)',userSelect:'all'}}>{p.account||' '}</span>
            <span style={{font:'500 12px var(--font-sans)',letterSpacing:'.08em',color:'var(--text-muted)'}}>{p.holder||' '}</span>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
window.GiftBox=GiftBox;
