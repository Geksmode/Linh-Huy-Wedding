function Story({t,theme}){
  const s=t.story;
  const pics=[['photobooth.png','50% 30%'],['picnic-selfie.png','50% 45%'],['heart-frame.png','50% 45%'],['campfire.png','45% 50%']];
  const colors=theme==='traditional'?['--cinnabar-500','--gold-500','--cinnabar-500','--gold-500']:['--marigold-500','--lotus-500','--jade-500','--lacquer-500'];
  return <main style={{padding:'80px 24px 96px'}}>
    <SectionHeading eyebrow={s.eyebrow} script={s.script} title={s.title}/>
    <div style={{maxWidth:880,margin:'56px auto 0',display:'grid',gap:48}}>
      {s.beats.map(([y,ti,b],i)=><div key={y} style={{display:'grid',gridTemplateColumns:i%2?'1fr 280px':'280px 1fr',gap:40,alignItems:'center'}}>
        {i%2===0&&<Photo label={y} src={pics[i][0]} pos={pics[i][1]} style={{height:300,borderRadius:'var(--radius-arch)'}}/>}
        <div style={{display:'grid',gap:10}}>
          <div style={{font:(y.length>4?'500 36px/1.1':'500 56px/1')+' var(--font-serif)',color:'var('+colors[i]+')'}}>{y}</div>
          <h3 style={{margin:0,font:'var(--fs-display-sm)/1.2 var(--font-display)',color:'var(--text-strong)'}}>{ti}</h3>
          <p style={{margin:0,font:'var(--fs-body-lg)/var(--lh-body) var(--font-serif)',color:'var(--text-body)'}}>{b}</p>
        </div>
        {i%2===1&&<Photo label={y} src={pics[i][0]} pos={pics[i][1]} style={{height:300,borderRadius:'var(--radius-arch)'}}/>}
      </div>)}
      <Divider variant="ampersand"/>
    </div>
  </main>;
}
window.Story=Story;
