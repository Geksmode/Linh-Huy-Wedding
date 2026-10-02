// Our story — illustrated map driven directly by scroll, so map, photo and text move together.
// Story stops: Paris & Phủ Lý → Seoul (met), Seoul → Paris (distance), Paris → Seoul (reunited), Seoul (life there), Seoul → Phủ Lý (wedding).
// Stops are indexed -1 (intro) to 4; each has a camera box in map coords (mapdots.js) and what is shown.
// Performance (iPad): the map is drawn on a canvas, and scrolling never re-renders React — each frame
// only redraws the canvas and sets opacity/transform on the photo and text layers.
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
const HEART='M0 7C-12-2-9-14 0-7C9-14 12-2 0 7Z';
const lerp=(a,b,t)=>a+(b-a)*t;
const clamp01=x=>Math.max(0,Math.min(1,x));

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
const layerStyle=(f,i,handover)=>{const o=beatOpacity(f,i,handover),{seg}=storyPhase(f);
  return {opacity:o,transform:'translateY('+((1-o)*(i>seg?18:-18))+'px)',pointerEvents:o>.5?'auto':'none'};};

// Dot centres parsed once from the SVG-style path in mapdots.js.
let storyDots=null;
const getDots=()=>storyDots||(storyDots=Float32Array.from(window.STORY_MAP.dots.match(/-?\d+/g),Number));

// Draws the whole map for story position f into a canvas of CSS size w×h; focus = free area (px) where
// the journey is framed. col = theme colours read from CSS variables.
function drawStoryMap(ctx,w,h,f,focus,places,mob,col){
  const C=window.STORY_MAP.cities,{seg,e}=storyPhase(f);
  const A=STORY_STEPS[seg+1],B=STORY_STEPS[seg+2],ca=STORY_CAMS[seg+1],cb=STORY_CAMS[seg+2];
  const v={};for(const n in A)v[n]=lerp(A[n],B[n],e);
  const [x0,y0,x1,y1]=ca.map((c,i)=>lerp(c,cb[i],e));
  const fr=focus||{x:0,y:0,w,h},ox=fr.x+fr.w/2,oy=fr.y+fr.h/2;
  const k=Math.min(fr.w/(x1-x0),fr.h/(y1-y0)),cx=(x0+x1)/2,cy=(y0+y1)/2;
  const P=([x,y])=>[(x-cx)*k+ox,(y-cy)*k+oy];
  ctx.clearRect(0,0,w,h);
  // Land dots (only those on screen).
  const d=getDots(),r=(2+1.6*k)/2;ctx.beginPath();
  for(let i=0;i<d.length;i+=2){const sx=(d[i]-cx)*k+ox,sy=(d[i+1]-cy)*k+oy;
    if(sx<-r||sy<-r||sx>w+r||sy>h+r)continue;ctx.moveTo(sx+r,sy);ctx.arc(sx,sy,r,0,6.2832);}
  ctx.globalAlpha=.4;ctx.fillStyle=col.taupe;ctx.fill();ctx.globalAlpha=1;
  // Quadratic arc between two cities, bulging sideways by `bend` × distance.
  const arc=(a,b,bend)=>{const p0=P(a),p2=P(b),dx=p2[0]-p0[0],dy=p2[1]-p0[1],p1=[(p0[0]+p2[0])/2+dy*bend,(p0[1]+p2[1])/2-dx*bend];
    const at=t=>[0,1].map(j=>(1-t)*(1-t)*p0[j]+2*(1-t)*t*p1[j]+t*t*p2[j]);
    const dir=t=>Math.atan2(2*(1-t)*(p1[1]-p0[1])+2*t*(p2[1]-p1[1]),2*(1-t)*(p1[0]-p0[0])+2*t*(p2[0]-p1[0]));
    // Exact first part of the curve up to t (de Casteljau), so the line ends right under the plane.
    const draw=t=>{const q=[0,1].map(j=>lerp(p0[j],p1[j],t)),end=at(t);ctx.beginPath();ctx.moveTo(p0[0],p0[1]);ctx.quadraticCurveTo(q[0],q[1],end[0],end[1]);ctx.stroke();};
    return {at,dir,draw};};
  const routes={r0:[arc(C.paris,C.seoul,.18),col.lotus,v.dim0],r1:[arc(C.phuly,C.seoul,-.3),col.marigold,v.dim1],r3:[arc(C.seoul,C.phuly,-.3),col.accent,0]};
  ctx.lineWidth=3.5;ctx.lineCap='round';ctx.setLineDash([.1,11]);
  for(const id in routes){const [rt,c,dim]=routes[id];if(v[id]<=.001)continue;ctx.globalAlpha=1-.65*dim;ctx.strokeStyle=c;rt.draw(v[id]);}
  ctx.setLineDash([]);ctx.globalAlpha=1;
  // City pins and labels.
  const pin=(id,lit,side)=>{const [px,py]=P(C[id]),[city,country]=places[id],right=side==='r';
    ctx.globalAlpha=lit;ctx.beginPath();ctx.arc(px,py,6,0,6.2832);ctx.fillStyle=col.white;ctx.fill();ctx.lineWidth=2.5;ctx.strokeStyle=col.strong;ctx.stroke();
    const lx=px+(right?14:0),ly=py+(right?-2:26);ctx.textAlign=right?'left':'center';
    ctx.font='600 '+(mob?10:11)+'px "Be Vietnam Pro", system-ui, sans-serif';ctx.fillStyle=col.strong;ctx.fillText(city.toUpperCase(),lx,ly);
    ctx.font='italic '+(mob?12:14)+'px "EB Garamond", Georgia, serif';ctx.fillStyle=col.muted;ctx.fillText(country,lx,ly+(mob?13:15));
    ctx.globalAlpha=1;};
  pin('paris',v.lp,'b');pin('phuly',v.ll,'b');pin('seoul',v.ls,'r');
  const shape=(path,x,y,rot,s,fill)=>{ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.scale(s,s);ctx.fillStyle=fill;ctx.fill(path);ctx.lineWidth=2/s;ctx.strokeStyle=col.white;ctx.stroke(path);ctx.restore();};
  const heart=new Path2D(HEART);
  [['seoul',v.h2],['phuly',v.h3]].forEach(([id,s])=>{if(s>.01){const [px,py]=P(C[id]);shape(heart,px,py-22,0,1.6*s,col.accent);}});
  // Planes in flight.
  const plane=new Path2D(PLANE);
  if(e>0&&e<1)(STORY_FLIGHTS[seg]||[]).forEach(([id,dirn])=>{const rt=routes[id][0],t=dirn>0?e:1-e,[px,py]=rt.at(t);
    ctx.globalAlpha=Math.min(1,e*8,(1-e)*8);shape(plane,px,py,rt.dir(t)+(dirn>0?0:Math.PI),mob?1.1:1.3,col.strong);ctx.globalAlpha=1;});
}

// The map, photo and text share one frame pinned to the screen; scrolling through the section only
// moves the story forward (f), so the three always change together.
function Story({t,theme}){
  // mob = phone sizes; stacked = map / photo / text in a column (phones and tablets in portrait).
  const s=t.story;const mob=useIsMobile(),stacked=useIsMobile(900);const n=s.beats.length;
  const pics=[['photobooth.png','50% 30%'],['story-linh-cafe.jpg','50% 38%'],['story-cafe.jpg','50% 58%'],['story-seoul-selfie.jpg','50% 52%'],['campfire.png','45% 50%']];
  const colors=theme==='traditional'?['--cinnabar-500','--gold-500','--cinnabar-500','--gold-500','--cinnabar-500']:['--marigold-500','--lotus-500','--jade-500','--hibiscus-500','--lacquer-500'];
  const sec=React.useRef(),card=React.useRef(),gapRef=React.useRef(),canvas=React.useRef();
  const photoEls=React.useRef([]),textEls=React.useRef([]);
  const [navH,setNavH]=React.useState(80);
  React.useEffect(()=>{const hd=document.querySelector('header');if(hd)setNavH(hd.offsetHeight)},[mob,stacked]);
  React.useEffect(()=>{
    const cs=getComputedStyle(document.documentElement),cv=n=>cs.getPropertyValue(n).trim();
    const col={taupe:cv('--taupe'),lotus:cv('--lotus-500'),marigold:cv('--marigold-500'),accent:cv('--accent-primary'),white:cv('--white'),strong:cv('--text-strong'),muted:cv('--text-muted')};
    let raf=0,cur=null,last=0,size={w:0,h:0},focus=null,drawn='';
    const target=()=>{const r=sec.current.getBoundingClientRect(),run=r.height-(innerHeight-navH);return -1+n*clamp01((navH-r.top)/run);};
    const paint=f=>{
      const ctx=canvas.current&&canvas.current.getContext('2d');
      // While a stop is held still (same seg, e = 0 or 1) the map does not change: skip the redraw.
      const {seg,e}=storyPhase(f),key=seg+':'+e.toFixed(4)+':'+size.w+'x'+size.h;
      if(ctx&&size.w&&key!==drawn){drawn=key;const dpr=Math.min(2,devicePixelRatio||1);ctx.setTransform(dpr,0,0,dpr,0,0);drawStoryMap(ctx,size.w,size.h,f,focus,s.places,mob,col);}
      photoEls.current.forEach((el,i)=>el&&Object.assign(el.style,layerStyle(f,i,false)));
      textEls.current.forEach((el,i)=>{if(!el)return;Object.assign(el.style,layerStyle(f,i,true));el.setAttribute('aria-hidden',beatOpacity(f,i,true)<.5);});
    };
    // The story glides towards the scroll position (instead of jumping with each mouse-wheel notch).
    const tick=now=>{raf=0;const tg=target(),dt=Math.min(64,now-(last||now));last=now;
      const prev=cur;cur=cur===null?tg:cur+(tg-cur)*(1-Math.exp(-dt/110));
      if(Math.abs(tg-cur)<.001)cur=tg;else raf=requestAnimationFrame(tick);
      if(cur!==prev)paint(cur);if(!raf)last=0;};
    const on=()=>{if(!raf)raf=requestAnimationFrame(tick)};
    // Canvas size follows the card; focus = free area between text and photo.
    const resize=()=>{const c=card.current.getBoundingClientRect(),g=gapRef.current.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);
      size={w:c.width,h:c.height};focus={x:g.left-c.left,y:g.top-c.top,w:g.width,h:g.height};
      canvas.current.width=Math.round(c.width*dpr);canvas.current.height=Math.round(c.height*dpr);
      drawn='';if(cur!==null)paint(cur);on();};
    const ro=new ResizeObserver(resize);ro.observe(card.current);ro.observe(gapRef.current);
    document.fonts&&document.fonts.ready.then(()=>{drawn='';if(cur!==null)paint(cur)});
    on();addEventListener('scroll',on,{passive:true});
    return()=>{ro.disconnect();removeEventListener('scroll',on);cancelAnimationFrame(raf)};
  },[mob,stacked,navH,n,s]);
  // Stacked layers: every beat sits in the same grid cell, only the current one is visible.
  const photos=<div style={{display:'grid'}}>{s.beats.map(([y],i)=><div key={y} ref={el=>photoEls.current[i]=el} style={{gridArea:'1/1',width:'100%',maxWidth:stacked&&!mob?520:undefined,justifySelf:'center',...layerStyle(-1,i,false)}}>
    <Photo label={y} src={pics[i][0]} pos={pics[i][1]} style={{height:mob?'min(280px, 23vh)':stacked?'min(380px, 32vh)':400,width:'100%',borderRadius:stacked?'var(--radius-lg)':'var(--radius-arch)',boxShadow:'var(--shadow-paper)'}}/>
  </div>)}</div>;
  const texts=<div style={{display:'grid'}}>{s.beats.map(([y,ti,b],i)=><div key={y} ref={el=>textEls.current[i]=el} aria-hidden={i>0} style={{gridArea:'1/1',...layerStyle(-1,i,true),display:'grid',gap:mob?8:14,alignContent:stacked?'start':'center'}}>
    <div style={{font:(y.length>4?'500 '+(mob?28:36)+'px/1.1':'500 '+(mob?40:56)+'px/1')+' var(--font-serif)',color:'var('+colors[i]+')'}}>{y}</div>
    <h3 style={{margin:0,font:'var(--fs-display-sm)/1.2 var(--font-display)',color:'var(--text-strong)'}}>{ti}</h3>
    <p style={{margin:0,font:'var(--fs-body-lg)/var(--lh-body) var(--font-serif)',color:'var(--text-body)',maxWidth:'42ch'}}>{b}</p>
  </div>)}</div>;
  const map=<canvas ref={canvas} role="img" aria-label={s.mapLabel} style={{position:'absolute',inset:0,width:'100%',height:'100%'}}/>;
  const cardStyle={position:'relative',width:'100%',maxWidth:1200,margin:'0 auto',borderRadius:'var(--radius-lg)',overflow:'hidden',background:'var(--paper-2)'};
  return <main style={{padding:mob?'56px 16px 64px':'80px 24px 96px'}}>
    <SectionHeading eyebrow={s.eyebrow} script={s.script} title={s.title}/>
    <section ref={sec} style={{height:'calc('+(100+n*75)+'vh - '+navH+'px)',marginTop:mob?24:40}}>
      <div style={{position:'sticky',top:navH,height:'calc(100vh - '+navH+'px)',display:'grid',alignItems:'center'}}>
        {stacked
          ?<div ref={card} style={{...cardStyle,height:'calc(100% - 16px)'}}>
            {map}
            <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'linear-gradient(180deg,transparent 0%,transparent 24%,var(--paper-2) 40%)'}}/>
            <div style={{position:'relative',height:'100%',display:'grid',gridTemplateRows:'clamp(100px,22vh,'+(mob?200:260)+'px) auto 1fr',gap:mob?10:20,padding:mob?12:28}}>
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
