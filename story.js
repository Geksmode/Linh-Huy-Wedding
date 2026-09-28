function Story({t,theme}){
  const s=t.story;const mob=useIsMobile();
  const pics=[['photobooth.png','50% 30%'],['picnic-selfie.png','50% 45%'],['heart-frame.png','50% 45%'],['campfire.png','45% 50%']];
  const colors=theme==='traditional'?['--cinnabar-500','--gold-500','--cinnabar-500','--gold-500']:['--marigold-500','--lotus-500','--jade-500','--lacquer-500'];
  return <main style={{padding:mob?'56px 20px 64px':'80px 24px 96px'}}>
    <SectionHeading eyebrow={s.eyebrow} script={s.script} title={s.title}/>
    <div style={{maxWidth:880,margin:(mob?40:56)+'px auto 0',display:'grid',gap:mob?44:48}}>
      {s.beats.map(([y,ti,b],i)=><div key={y} style={{display:'grid',gridTemplateColumns:mob?'1fr':(i%2?'1fr 280px':'280px 1fr'),gap:mob?18:40,alignItems:'center'}}>
        {(mob||i%2===0)&&<Photo label={y} src={pics[i][0]} pos={pics[i][1]} style={{height:mob?340:300,borderRadius:'var(--radius-arch)'}}/>}
        <div style={{display:'grid',gap:10}}>
          <div style={{font:(y.length>4?'500 '+(mob?30:36)+'px/1.1':'500 '+(mob?44:56)+'px/1')+' var(--font-serif)',color:'var('+colors[i]+')'}}>{y}</div>
          <h3 style={{margin:0,font:'var(--fs-display-sm)/1.2 var(--font-display)',color:'var(--text-strong)'}}>{ti}</h3>
          <p style={{margin:0,font:'var(--fs-body-lg)/var(--lh-body) var(--font-serif)',color:'var(--text-body)'}}>{b}</p>
        </div>
        {!mob&&i%2===1&&<Photo label={y} src={pics[i][0]} pos={pics[i][1]} style={{height:mob?340:300,borderRadius:'var(--radius-arch)'}}/>}
      </div>)}
      <Divider variant="ampersand"/>
    </div>
  </main>;
}
window.Story=Story;
