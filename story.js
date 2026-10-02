// Our story — illustrated map driven directly by scroll, so map, photo and text move together.
// Story stops: Paris & Phủ Lý → Seoul (met), Seoul → Paris (distance), Paris → Seoul (reunited), Seoul (life there), Seoul → Phủ Lý (wedding).
// Stops are indexed -1 (intro) to 4; each has a camera box in map coords (mapdots.js) and what is shown.
const STORY_CAMS=[[1377,180,2705,740],[1397,240,2797,660],[1397,240,2797,660],[2257,274,2777,574],[2347,324,2687,524],[2217,310,2647,670]];
const STORY_STEPS=[
  {r0:0,r1:0,r3:0,dim0:0,dim1:0,h2:0,h3:0,lp:.5,ls:.5,ll:.5},
  {r0:1,r1:1,r3:0,dim0:0,dim1:0,h2:0,h3:0,lp:1,ls:1,ll:1},
  {r0:1,r1:1,r3:0,dim0:0,dim1:1,h2:0,h3:0,lp:1,ls:1,ll:.5},
  {r0:1,r1:1,r3:0,dim0:1,dim1:1,h2:1,h3:0,lp:.5,ls:1,ll:.5},
  {r0:1,r1:1,r3:0,dim0:1,dim1:1,h2:1,h3:0,lp:.5,ls:1,ll:.5},
  {r0:1,r1:1,r3:1,dim0:1,dim1:1,h2:1,h3:1,lp:.5,ls:1,ll:1}
];
// Planes flying while scrolling from stop i to stop i+1 (key = i): route and direction.
const STORY_FLIGHTS={'-1':[['r0',1],['r1',1]],0:[['r0',-1]],1:[['r0',1]],3:[['r3',1]]};
const PLANE='M11 0C11-1.2 9-1.6 7-1.6H2L-4-9H-7L-3-1.6H-8L-10-4.5H-12L-11 0-12 4.5H-10L-8 1.6H-3L-7 9H-4L2 1.6H7C9 1.6 11 1.2 11 0Z';
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp01=x=>Math.max(0,Math.min(1,x));

function useSize(ref){
  const [s,setS]=React.useState({w:0,h:0});
  React.useEffect(()=>{const ro=new ResizeObserver(([e])=>setS({w:e.contentRect.width,h:e.contentRect.height}));ro.observe(ref.current);return()=>ro.disconnect()},[]);
  return s;
}

// f: continuous position in the story (-1 … last stop). Between two stops, the change (e: 0 → 1) happens in
// the middle of the scroll, so everything holds still for a while on each stop.
function storyPhase(f){
  const seg=Math.min(STORY_STEPS.length-3,Math.floor(f)),x=clamp01((f-seg-.2)/.6);
  return {seg,e:x*x*(3-2*x)};
}
// Visibility of beat i: it fades out exactly while the map flies to the next stop. Photos cross-fade;
// texts hand over (old one gone by mid-flight, new one after) so they never overlap.
const beatOpacity=(f,i,handover)=>{const {seg,e}=storyPhase(f);if(seg<0)return i===0?1:0;
  if(i===seg)return handover?clamp01(1-2*e):1-e;if(i===seg+1)return handover?clamp01(2*e-1):e;return 0;};

// focus: the free area (px, inside the map box) where the journey is framed; defaults to the whole box.
function StoryMap({f,places,label,mob,focus}){
  const M=window.STORY_MAP,C=M.cities;const box=React.useRef();const {w,h}=useSize(box);
  const {seg,e}=storyPhase(f);
  const A=STORY_STEPS[seg+1],B=STORY_STEPS[seg+2],ca=STORY_CAMS[seg+1],cb=STORY_CAMS[seg+2];
  const v={};for(const n in A)v[n]=lerp(A[n],B[n],e);
  const [x0,y0,x1,y1]=ca.map((c,i)=>lerp(c,cb[i],e));
  const fr=focus||{x:0,y:0,w,h},ox=fr.x+fr.w/2,oy=fr.y+fr.h/2;
  const k=fr.w&&fr.h?Math.min(fr.w/(x1-x0),fr.h/(y1-y0)):0,cx=(x0+x1)/2,cy=(y0+y1)/2;
  const P=([x,y])=>[(x-cx)*k+ox,(y-cy)*k+oy];
  // Quadratic arc between two cities, bulging sideways by `bend` × distance.
  const arc=(a,b,bend)=>{const p0=P(a),p2=P(b),dx=p2[0]-p0[0],dy=p2[1]-p0[1],p1=[(p0[0]+p2[0])/2+dy*bend,(p0[1]+p2[1])/2-dx*bend];
    const at=t=>[0,1].map(j=>(1-t)*(1-t)*p0[j]+2*(1-t)*t*p1[j]+t*t*p2[j]);
    const dir=t=>Math.atan2(2*(1-t)*(p1[1]-p0[1])+2*t*(p2[1]-p1[1]),2*(1-t)*(p1[0]-p0[0])+2*t*(p2[0]-p1[0]))*180/Math.PI;
    // Exact first part of the curve up to t (de Casteljau), so the line ends right under the plane.
    const upTo=t=>{const q=[0,1].map(j=>lerp(p0[j],p1[j],t)),end=at(t);return `M${p0[0]} ${p0[1]}Q${q[0]} ${q[1]} ${end[0]} ${end[1]}`;};
    return {at,dir,upTo};};
  const routes={r0:[arc(C.paris,C.seoul,.18),'var(--lotus-500)',v.dim0],r1:[arc(C.phuly,C.seoul,-.3),'var(--marigold-500)',v.dim1],r3:[arc(C.seoul,C.phuly,-.3),'var(--accent-primary)',0]};
  const flights=e>0&&e<1?STORY_FLIGHTS[seg]||[]:[];
  const pin=(id,lit,side)=>{const [px,py]=P(C[id]),[city,country]=places[id];const lx=side==='r'?14:0,ly=side==='r'?-2:26,anchor=side==='r'?'start':'middle';
    return <g key={id} transform={`translate(${px} ${py})`} style={{opacity:lit}}>
      {lit>.9&&<circle r="7" fill="var(--accent-primary)" className="lh-pulse"/>}
      <circle r="6" fill="var(--white)" stroke="var(--text-strong)" strokeWidth="2.5"/>
      <text x={lx} y={ly} textAnchor={anchor} style={{font:'600 '+(mob?10:11)+'px var(--font-sans)',letterSpacing:'.16em',textTransform:'uppercase',fill:'var(--text-strong)'}}>{city}</text>
      <text x={lx} y={ly+(mob?13:15)} textAnchor={anchor} style={{font:'italic '+(mob?12:14)+'px var(--font-serif)',fill:'var(--text-muted)'}}>{country}</text>
    </g>;};
  const heart=(id,s)=>{const [px,py]=P(C[id]);return s>.01&&<path key={'h'+id} d="M0 7C-12-2-9-14 0-7C9-14 12-2 0 7Z" fill="var(--accent-primary)" stroke="var(--white)" strokeWidth="2" transform={`translate(${px} ${py-22}) scale(${1.6*s})`}/>;};
  return <div ref={box} role="img" aria-label={label} style={{position:'absolute',inset:0}}>
    {w>0&&<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:'block'}} aria-hidden="true">
      <path d={M.dots} transform={`translate(${ox} ${oy}) scale(${k}) translate(${-cx} ${-cy})`} stroke="var(--taupe)" strokeOpacity=".4" strokeWidth={(2+1.6*k)/k} strokeLinecap="round" fill="none"/>
      {Object.entries(routes).map(([id,[r,color,dim]])=>v[id]>.001&&<path key={id} d={r.upTo(v[id])} stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" strokeDasharray="0.1 11"
        style={{opacity:1-.65*dim}} className={id==='r0'&&Math.abs(f-1)<.2?'lh-flow':undefined}/>)}
      {pin('paris',v.lp,'b')}{pin('phuly',v.ll,'b')}{pin('seoul',v.ls,'r')}
      {heart('seoul',v.h2)}{heart('phuly',v.h3)}
      {flights.map(([id,d])=>{const r=routes[id][0],t=d>0?e:1-e,[px,py]=r.at(t),a=r.dir(t)+(d>0?0:180);
        return <path key={'p'+id} d={PLANE} fill="var(--text-strong)" stroke="var(--white)" strokeWidth="1" style={{opacity:Math.min(1,e*8,(1-e)*8)}}
          transform={`translate(${px} ${py}) rotate(${a}) scale(${mob?1.1:1.3})`}/>;})}
    </svg>}
  </div>;
}

// The map, photo and text share one frame pinned to the screen; scrolling through the section only
// moves the story forward (f), so the three always change together.
function Story({t,theme}){
  const s=t.story;const mob=useIsMobile();const n=s.beats.length;
  const pics=[['photobooth.png','50% 30%'],['story-linh-cafe.jpg','50% 38%'],['story-cafe.jpg','50% 58%'],['story-seoul-selfie.jpg','50% 52%'],['campfire.png','45% 50%']];
  const colors=theme==='traditional'?['--cinnabar-500','--gold-500','--cinnabar-500','--gold-500','--cinnabar-500']:['--marigold-500','--lotus-500','--jade-500','--hibiscus-500','--lacquer-500'];
  const sec=React.useRef();const [f,setF]=React.useState(-1);
  const [navH,setNavH]=React.useState(80);
  React.useEffect(()=>{const hd=document.querySelector('header');if(hd)setNavH(hd.offsetHeight)},[mob]);
  // The story glides towards the scroll position (instead of jumping with each mouse-wheel notch).
  React.useEffect(()=>{
    let raf=0,cur=null,last=0;
    const target=()=>{const r=sec.current.getBoundingClientRect(),run=r.height-(innerHeight-navH);return -1+n*clamp01((navH-r.top)/run);};
    const tick=now=>{raf=0;const tg=target(),dt=Math.min(64,now-(last||now));last=now;
      cur=cur===null?tg:cur+(tg-cur)*(1-Math.exp(-dt/110));
      if(Math.abs(tg-cur)<.001)cur=tg;else raf=requestAnimationFrame(tick);
      setF(cur);if(!raf)last=0;};
    const on=()=>{if(!raf)raf=requestAnimationFrame(tick)};
    on();addEventListener('scroll',on,{passive:true});addEventListener('resize',on);
    return()=>{removeEventListener('scroll',on);removeEventListener('resize',on);cancelAnimationFrame(raf)};
  },[mob,navH,n]);
  // Stacked layers: every beat sits in the same grid cell, only the current one is visible.
  const layer=(i,handover)=>{const o=beatOpacity(f,i,handover),{seg}=storyPhase(f);
    return {gridArea:'1/1',opacity:o,transform:'translateY('+((1-o)*(i>seg?18:-18))+'px)',pointerEvents:o>.5?'auto':'none'};};
  const photos=<div style={{display:'grid'}}>{s.beats.map(([y],i)=><Photo key={y} label={y} src={pics[i][0]} pos={pics[i][1]}
    style={{...layer(i),height:mob?'min(280px, 23vh)':400,width:'100%',borderRadius:mob?'var(--radius-lg)':'var(--radius-arch)',boxShadow:'var(--shadow-paper)'}}/>)}</div>;
  const texts=<div style={{display:'grid'}}>{s.beats.map(([y,ti,b],i)=><div key={y} aria-hidden={beatOpacity(f,i,true)<.5} style={{...layer(i,true),display:'grid',gap:mob?8:14,alignContent:mob?'start':'center'}}>
    <div style={{font:(y.length>4?'500 '+(mob?28:36)+'px/1.1':'500 '+(mob?40:56)+'px/1')+' var(--font-serif)',color:'var('+colors[i]+')'}}>{y}</div>
    <h3 style={{margin:0,font:'var(--fs-display-sm)/1.2 var(--font-display)',color:'var(--text-strong)'}}>{ti}</h3>
    <p style={{margin:0,font:'var(--fs-body-lg)/var(--lh-body) var(--font-serif)',color:'var(--text-body)',maxWidth:'42ch'}}>{b}</p>
  </div>)}</div>;
  // Measure the free area between the text and the photo so the map frames the journey there.
  const card=React.useRef(),gapRef=React.useRef();const [focus,setFocus]=React.useState(null);
  React.useEffect(()=>{
    const measure=()=>{if(!card.current||!gapRef.current)return;const c=card.current.getBoundingClientRect(),g=gapRef.current.getBoundingClientRect();
      setFocus({x:g.left-c.left,y:g.top-c.top,w:g.width,h:g.height});};
    const ro=new ResizeObserver(measure);ro.observe(card.current);ro.observe(gapRef.current);return()=>ro.disconnect();
  },[mob]);
  const map=<StoryMap f={f} places={s.places} label={s.mapLabel} mob={mob} focus={focus}/>;
  const cardStyle={position:'relative',width:'100%',maxWidth:1200,margin:'0 auto',borderRadius:'var(--radius-lg)',overflow:'hidden',background:'var(--paper-2)'};
  return <main style={{padding:mob?'56px 16px 64px':'80px 24px 96px'}}>
    <style>{`.lh-pulse{transform-box:fill-box;transform-origin:center;animation:lhpulse 1.8s var(--ease-out) infinite}
@keyframes lhpulse{from{transform:scale(1);opacity:.55}to{transform:scale(3.2);opacity:0}}
.lh-flow{animation:lhflow .7s linear infinite}@keyframes lhflow{to{stroke-dashoffset:-11.1}}
@media (prefers-reduced-motion:reduce){.lh-pulse,.lh-flow{animation:none}}`}</style>
    <SectionHeading eyebrow={s.eyebrow} script={s.script} title={s.title}/>
    <section ref={sec} style={{height:'calc('+(100+n*75)+'vh - '+navH+'px)',marginTop:mob?24:40}}>
      <div style={{position:'sticky',top:navH,height:'calc(100vh - '+navH+'px)',display:'grid',alignItems:'center'}}>
        {mob
          ?<div ref={card} style={{...cardStyle,height:'calc(100% - 16px)'}}>
            {map}
            <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(180deg,transparent 0%,transparent 24%,var(--paper-2) 40%)'}}/>
            <div style={{position:'relative',height:'100%',display:'grid',gridTemplateRows:'clamp(100px,22vh,200px) auto 1fr',gap:10,padding:12}}>
              <div ref={gapRef}/>{photos}{texts}
            </div>
          </div>
          :<div ref={card} style={{...cardStyle,height:'min(640px, calc(100% - 48px))'}}>
            {map}
            <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(90deg,var(--paper-2) 0%,color-mix(in srgb,var(--paper-2) 80%,transparent) 30%,transparent 44%)'}}/>
            <div style={{position:'relative',height:'100%',display:'grid',gridTemplateColumns:'minmax(0,1fr) minmax(0,1.1fr) minmax(0,300px)',gap:32,padding:'40px 48px',alignItems:'center'}}>
              {texts}<div ref={gapRef} style={{alignSelf:'stretch'}}/>{photos}
            </div>
          </div>}
      </div>
    </section>
    <div style={{maxWidth:880,margin:(mob?24:40)+'px auto 0'}}><Divider variant="ampersand"/></div>
  </main>;
}
window.Story=Story;
