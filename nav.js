function LangToggle({lang,setLang}){
  return <div role="group" aria-label="Language" style={{display:'flex',background:'var(--bg-alt)',borderRadius:'var(--radius-pill)',padding:3,gap:2}}>
    {[['vi','VI'],['en','EN']].map(([k,l])=><button key={k} onClick={()=>setLang(k)} aria-pressed={lang===k} style={{height:36,minWidth:40,padding:'0 10px',border:0,borderRadius:'var(--radius-pill)',cursor:'pointer',font:'600 11px var(--font-sans)',letterSpacing:'.12em',background:lang===k?'var(--text-strong)':'transparent',color:lang===k?'var(--paper)':'var(--text-strong)',transition:'background var(--dur-fast) var(--ease-out)'}}>{l}</button>)}
  </div>;
}
function useIsMobile(bp=720){
  const q='(max-width:'+bp+'px)';
  const [m,setM]=React.useState(()=>window.matchMedia(q).matches);
  React.useEffect(()=>{const mq=window.matchMedia(q);const h=e=>setM(e.matches);mq.addEventListener('change',h);return()=>mq.removeEventListener('change',h)},[q]);
  return m;
}
function Nav({page,go,t,lang,setLang}){
  const items=['home','story','schedule'];const mob=useIsMobile();
  const link=k=><button key={k} onClick={()=>go(k)} style={{background:'none',border:0,padding:mob?'12px 4px':'6px 0',cursor:'pointer',font:'600 '+(mob?11:12)+'px var(--font-sans)',letterSpacing:mob?'.14em':'var(--ls-label)',textTransform:'uppercase',whiteSpace:'nowrap',color:page===k?'var(--accent-primary)':'var(--text-strong)',borderBottom:'2px solid '+(page===k?'var(--accent-primary)':'transparent')}}>{t.nav[k]}</button>;
  if(mob) return <header style={{position:'sticky',top:0,zIndex:10,background:'color-mix(in srgb, var(--bg-page) 94%, transparent)',backdropFilter:'blur(8px)',borderBottom:'1px solid var(--sand)'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,padding:'10px 16px 0'}}>
      <button onClick={()=>go('home')} style={{background:'none',border:0,cursor:'pointer',font:'32px/1 var(--font-script)',color:'var(--accent-primary)',padding:0}}>Linh &amp; Huy</button>
      <div style={{display:'flex',alignItems:'center',gap:8}}><LangToggle lang={lang} setLang={setLang}/><Button size="sm" onClick={()=>go('rsvp')}>{t.nav.rsvp}</Button></div>
    </div>
    <nav style={{display:'flex',justifyContent:'space-around',gap:8,padding:'0 12px'}}>{items.map(link)}</nav>
  </header>;
  return <header style={{position:'sticky',top:0,zIndex:10,background:'color-mix(in srgb, var(--bg-page) 92%, transparent)',backdropFilter:'blur(8px)',borderBottom:'1px solid var(--sand)'}}>
    <div style={{maxWidth:'var(--content-max)',margin:'0 auto',padding:'14px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,flexWrap:'wrap'}}>
      <button onClick={()=>go('home')} style={{background:'none',border:0,cursor:'pointer',font:'40px/1 var(--font-script)',color:'var(--accent-primary)',padding:0}}>Linh &amp; Huy</button>
      <nav style={{display:'flex',gap:24,alignItems:'center',flexWrap:'wrap'}}>
        {items.map(link)}
        <Button size="sm" onClick={()=>go('rsvp')}>{t.nav.rsvp}</Button>
        <LangToggle lang={lang} setLang={setLang}/>
      </nav>
    </div>
  </header>;
}
function Footer({t,theme}){
  const trad=theme==='traditional';
  return <footer style={{background:trad?'var(--cinnabar-700)':'var(--plum-night)',color:'var(--paper)',padding:'56px 24px',textAlign:'center',display:'grid',gap:10}}>
    <div style={{font:'var(--fs-script-md)/1 var(--font-script)',color:trad?'var(--gold-300)':'var(--mango-300)'}}>Linh &amp; Huy</div>
    <div style={{font:'600 12px var(--font-sans)',letterSpacing:'var(--ls-label)',textTransform:'uppercase',color:trad?'var(--cream)':'var(--lotus-300)'}}>{t.footer}</div>
  </footer>;
}
function Photo({label,src,pos='center',style}){
  if(src) return <div role="img" aria-label={label} style={{backgroundImage:'url('+src+')',backgroundSize:'cover',backgroundPosition:pos,...style}}/>;
  return <div style={{background:'repeating-linear-gradient(135deg,var(--paper-2) 0 12px,var(--blush) 12px 24px)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--cocoa)',font:'500 12px var(--font-sans)',letterSpacing:'.1em',textTransform:'uppercase',...style}}>{label}</div>;
}
function StyleSwitch(){return null;}
function _StyleSwitchUnused({theme,setTheme}){
  return <div style={{position:'fixed',left:16,bottom:16,zIndex:50,display:'flex',alignItems:'center',gap:8,background:'var(--white)',boxShadow:'var(--shadow-lift)',borderRadius:'var(--radius-pill)',padding:'6px 6px 6px 14px'}}>
    <span style={{font:'600 10px var(--font-sans)',letterSpacing:'.14em',textTransform:'uppercase',color:'var(--cocoa)'}}>Style</span>
    {[['traditional','Traditional'],['colorful','Colorful']].map(([k,l])=><button key={k} onClick={()=>setTheme(k)} style={{height:30,padding:'0 12px',border:0,borderRadius:'var(--radius-pill)',cursor:'pointer',font:'600 11px var(--font-sans)',background:theme===k?'var(--plum-ink)':'transparent',color:theme===k?'var(--paper)':'var(--plum-ink)'}}>{l}</button>)}
  </div>;
}
Object.assign(window,{useIsMobile,Nav,Footer,Photo,LangToggle,StyleSwitch});
