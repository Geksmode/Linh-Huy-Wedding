function Schedule({go,t,theme}){
  const s=t.sched;const trad=theme==='traditional';const hues=trad?[['cinnabar','gold','cinnabar'],['cinnabar','gold','cinnabar','gold']]:[['lotus','marigold','terracotta'],['lacquer','hibiscus','marigold','jade']];const tones=['marigold','lotus'];const mob=useIsMobile();
  return <main>
    <section style={{padding:mob?'56px 16px 48px':'80px 24px 64px'}}>
      <SectionHeading eyebrow={s.eyebrow} script={s.script} title={s.title}/>
      <div style={{margin:'28px auto 0',display:'grid',gap:6,justifyItems:'center',textAlign:'center'}}>
        <span style={{font:'600 11px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:'var(--text-muted)'}}>{s.venueLabel}</span>
        <span style={{font:'500 var(--fs-body-lg) var(--font-serif)',color:'var(--text-strong)'}}>{s.venue}</span>
        <span style={{font:'400 var(--fs-body) var(--font-serif)',color:'var(--text-muted)'}}>{s.venueAddr}</span>
      </div>
      {/* Vertical timeline: one continuous line per day, time | dot | event. */}
      <div style={{maxWidth:760,margin:(mob?36:56)+'px auto 0',display:'grid',gap:mob?40:56}}>
        {s.days.map((d,di)=><div key={di}>
          <div style={{display:'flex',alignItems:'baseline',gap:16,flexWrap:'wrap',borderBottom:'1px solid var(--sand)',paddingBottom:12,marginBottom:mob?24:32}}>
            <span style={{font:'600 12px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:'var(--accent-primary)'}}>{d.label}</span>
            <h3 style={{margin:0,font:'var(--fs-display-sm)/1.2 var(--font-display)',color:'var(--text-strong)'}}>{d.title}</h3>
          </div>
          <ol style={{listStyle:'none',margin:0,padding:0}}>
            {d.events.map(([time,title,note],i)=>{const last=i===d.events.length-1,hue='var(--'+hues[di][i%hues[di].length]+'-500)';
              return <li key={i} style={{display:'grid',gridTemplateColumns:mob?'20px 1fr':'150px 20px 1fr',columnGap:mob?14:24}}>
                {!mob&&<div style={{textAlign:'right',font:'600 15px/1.6 var(--font-sans)',color:'var(--text-muted)',paddingTop:1}}>{time}</div>}
                <div style={{position:'relative'}}>
                  {!last&&<div style={{position:'absolute',left:9,top:12,bottom:-12,width:2,background:'var(--sand)'}}/>}
                  <div style={{position:'absolute',left:3,top:5,width:14,height:14,borderRadius:'50%',background:hue,boxShadow:'0 0 0 3px var(--bg-page)'}}/>
                </div>
                <div style={{paddingBottom:last?0:(mob?24:32)}}>
                  {mob&&<div style={{font:'600 13px/1.6 var(--font-sans)',color:'var(--text-muted)'}}>{time}</div>}
                  <div style={{font:(mob?22:26)+'px/1.25 var(--font-display)',color:'var(--text-strong)'}}>{title}</div>
                  {note&&<div style={{marginTop:4,font:'italic '+(mob?16:17)+'px/1.45 var(--font-serif)',color:'var(--text-muted)'}}>{note}</div>}
                </div>
              </li>;})}
          </ol>
        </div>)}
      </div>
    </section>
    <section style={{background:trad?'var(--cinnabar-700)':'var(--plum-night)',padding:mob?'56px 20px':'72px 24px',textAlign:'center',display:'grid',gap:24,justifyItems:'center'}}>
      <SectionHeading tone="inverse" eyebrow={s.dressEyebrow} title={s.dressTitle}/>
      <p style={{margin:0,maxWidth:'var(--measure)',font:'var(--fs-body-lg)/var(--lh-body) var(--font-serif)',color:'var(--paper)'}}>{s.dressBody}</p>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center'}}>{s.badges.map((b,i)=><Badge key={b} tone={tones[i]}>{b}</Badge>)}</div>
      <Button variant="sun" onClick={()=>go('rsvp')}>{s.cta}</Button>
    </section>
  </main>;
}
window.Schedule=Schedule;
