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
    <Dialog open={status==='done'} onClose={()=>setStatus('idle')} script={r.thanks} title={yes?r.gotIt:r.miss}
      actions={<><Button onClick={()=>{setStatus('idle');go('schedule')}}>{r.toSched}</Button><Button variant="secondary" onClick={()=>setStatus('idle')}>{r.close}</Button></>}>
      {yes?r.yesMsg(f.name):r.noMsg}
    </Dialog>
  </main>;
}
window.Rsvp=Rsvp;
