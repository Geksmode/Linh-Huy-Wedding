function Home({go,t,theme}){
  const trad=theme==="traditional";
  const h=t.home;const mob=useIsMobile();
  return <main>
    <section style={{position:'relative',overflow:'hidden',background:trad?'var(--cinnabar-500)':'var(--lacquer-500)',color:'var(--paper)',padding:trad?(mob?'56px 20px 64px':'80px 24px 88px'):(mob?'56px 20px 0':'96px 24px 0'),textAlign:'center'}}>
      {trad&&<div style={{width:88,height:88,margin:'0 auto 22px',borderRadius:'50%',border:'2px solid var(--gold-300)',display:'flex',alignItems:'center',justifyContent:'center',font:'44px/1 serif',color:'var(--gold-300)'}}>囍</div>}
      <div style={{font:'600 12px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:trad?'var(--gold-300)':'var(--mango-300)'}}>{h.eyebrow}</div>
      <h1 style={{margin:'18px 0 0',font:'var(--fs-script-xl)/0.95 var(--font-script)',color:trad?'var(--gold-300)':'var(--mango-300)',fontWeight:400}}>Linh &amp; Huy</h1>
      <p style={{margin:'18px auto 0',font:'var(--fs-display-md)/1.1 var(--font-display)',maxWidth:760}}>{h.are} <span style={{fontStyle:'italic',color:trad?'var(--gold-300)':'var(--lotus-300)'}}>{h.married}</span></p>
      <div style={{font:'500 '+(mob?20:28)+'px/1.35 var(--font-serif)',marginTop:20,color:'var(--paper)',textWrap:'balance'}}>{h.date}</div>
      <div style={{display:'flex',flexDirection:mob?'column':'row',alignItems:'center',gap:mob?4:12,justifyContent:'center',marginTop:mob?24:32,flexWrap:'wrap'}}><Button variant="sun" size={mob?'md':'lg'} onClick={()=>go('rsvp')}>{h.rsvp}</Button><Button variant="ghost" size={mob?'md':'lg'} style={{color:'var(--paper)'}} onClick={()=>go('schedule')}>{h.sched}</Button></div>
      {!trad&&<div style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:0,marginTop:mob?40:64,height:mob?110:200}}>
        {[['--marigold-500',70],['--lotus-500',100],['--mango-500',85],['--hibiscus-500',60],['--jade-500',90],['--terracotta-500',75]].map(([c,ht],i)=><div key={i} style={{flex:1,maxWidth:200,height:ht+'%',background:'var('+c+')',borderRadius:'var(--radius-arch)'}}/>)}
      </div>}
    </section>
    <Families f={h.families} trad={trad} mob={mob}/>
    <section style={{padding:mob?'0 12px 56px':'0 24px 80px',display:'grid',gap:mob?24:32,justifyItems:'center'}}>
      <SectionHeading eyebrow={h.countEyebrow} title={h.countTitle}/>
      <Countdown date="2026-10-24T15:00:00+07:00" labels={h.units}/>
    </section>
    <section style={{padding:mob?'0 16px 64px':'0 24px 96px'}}>
      <div style={{maxWidth:'var(--content-max)',margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(260px,100%),1fr))',gap:mob?14:20}}>
        <Photo label={h.photos[0]} src="studio-white.jpg" pos="50% 25%" style={{height:mob?360:420,borderRadius:'var(--radius-arch)'}}/>
        <Photo label={h.photos[1]} src="vogue-hearts.jpg" pos="50% 40%" style={{height:mob?360:420,borderRadius:'var(--radius-lg)'}}/>
        <Photo label={h.photos[2]} src="candlelight.jpg" pos="50% 45%" style={{height:mob?360:420,borderRadius:'var(--radius-arch)'}}/>
      </div>
    </section>
  </main>;
}
function Families({f,trad,mob}){
  const lab={font:'600 12px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:'var(--accent-primary)'};
  const side=(title,parents,addr)=><div style={{display:'grid',gap:6,justifyItems:'center',textAlign:'center'}}>
    <span style={lab}>{title}</span>
    {parents.map(p=><span key={p} style={{font:'400 var(--fs-body-lg)/1.35 var(--font-serif)',color:'var(--text-strong)'}}>{p}</span>)}
    <span style={{font:'italic var(--fs-body-sm)/1.45 var(--font-serif)',color:'var(--text-muted)',maxWidth:260}}>{addr}</span>
  </div>;
  return <section style={{padding:mob?'56px 20px':'80px 24px',display:'grid',gap:mob?28:36,justifyItems:'center'}}>
    <span style={lab}>{f.eyebrow}</span>
    <div style={{display:'grid',gap:4,justifyItems:'center',textAlign:'center',marginTop:-16}}>
      <div style={{font:'500 '+(mob?28:36)+'px/1.2 var(--font-display)',color:'var(--accent-primary)'}}>{f.groom}</div>
      <div style={{font:'italic 400 28px/1 var(--font-display)',color:'var(--accent-warm)'}}>&amp;</div>
      <div style={{font:'500 '+(mob?28:36)+'px/1.2 var(--font-display)',color:'var(--accent-primary)'}}>{f.bride}</div>
    </div>
    <div style={{width:'min(640px,100%)'}}><Divider variant={trad?'diamond':'dots'} color={trad?'var(--gold-300)':undefined}/></div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(240px,100%),1fr))',gap:mob?28:40,width:'min(720px,100%)'}}>
      {side(f.groomSide,f.groomParents,f.groomAddr)}
      {side(f.brideSide,f.brideParents,f.brideAddr)}
    </div>
  </section>;
}
window.Home=Home;
