function Schedule({go,t,theme}){
  const s=t.sched;const trad=theme==='traditional';const hues=trad?[['cinnabar','gold','cinnabar'],['cinnabar','gold','cinnabar','gold']]:[['lotus','marigold','terracotta'],['lacquer','hibiscus','marigold','jade']];const tones=['marigold','lotus'];
  return <main>
    <section style={{padding:'80px 24px 64px'}}>
      <SectionHeading eyebrow={s.eyebrow} script={s.script} title={s.title}/>
      <div style={{margin:'28px auto 0',display:'grid',gap:6,justifyItems:'center',textAlign:'center'}}>
        <span style={{font:'600 11px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:'var(--text-muted)'}}>{s.venueLabel}</span>
        <span style={{font:'500 var(--fs-body-lg) var(--font-serif)',color:'var(--text-strong)'}}>{s.venue}</span>
        <span style={{font:'400 var(--fs-body) var(--font-serif)',color:'var(--text-muted)'}}>{s.venueAddr}</span>
      </div>
      <div style={{maxWidth:'var(--content-max)',margin:'48px auto 0',display:'grid',gap:56}}>
        {s.days.map((d,di)=><div key={di} style={{display:'grid',gap:20}}>
          <div style={{display:'flex',alignItems:'baseline',gap:16,flexWrap:'wrap',borderBottom:'1px solid var(--sand)',paddingBottom:12}}>
            <span style={{font:'600 12px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:'var(--accent-primary)'}}>{d.label}</span>
            <h3 style={{margin:0,font:'var(--fs-display-sm)/1.2 var(--font-display)',color:'var(--text-strong)'}}>{d.title}</h3>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:20}}>
            {d.events.map(([time,title,note],i)=><EventCard key={i} time={time} title={title} note={note||undefined} hue={hues[di][i%hues[di].length]}/>)}
          </div>
        </div>)}
      </div>
    </section>
    <section style={{background:trad?'var(--cinnabar-700)':'var(--plum-night)',padding:'72px 24px',textAlign:'center',display:'grid',gap:24,justifyItems:'center'}}>
      <SectionHeading tone="inverse" eyebrow={s.dressEyebrow} title={s.dressTitle}/>
      <p style={{margin:0,maxWidth:'var(--measure)',font:'var(--fs-body-lg)/var(--lh-body) var(--font-serif)',color:'var(--paper)'}}>{s.dressBody}</p>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>{s.badges.map((b,i)=><Badge key={b} tone={tones[i]}>{b}</Badge>)}</div>
      <Button variant="sun" onClick={()=>go('rsvp')}>{s.cta}</Button>
    </section>
  </main>;
}
window.Schedule=Schedule;
