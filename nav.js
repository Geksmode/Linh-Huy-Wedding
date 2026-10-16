function LangToggle({lang,setLang}){
  return <div role="group" aria-label="Language" style={{display:'flex',background:'var(--bg-alt)',borderRadius:'var(--radius-pill)',padding:3,gap:2}}>
    {[['vi','VI'],['fr','FR'],['en','EN']].map(([k,l])=><button key={k} onClick={()=>setLang(k)} aria-pressed={lang===k} style={{height:36,minWidth:40,padding:'0 10px',border:0,borderRadius:'var(--radius-pill)',cursor:'pointer',font:'600 11px var(--font-sans)',letterSpacing:'.12em',background:lang===k?'var(--text-strong)':'transparent',color:lang===k?'var(--paper)':'var(--text-strong)',transition:'background var(--dur-fast) var(--ease-out)'}}>{l}</button>)}
  </div>;
}
function useIsMobile(bp=720){
  const q='(max-width:'+bp+'px)';
  const [m,setM]=React.useState(()=>window.matchMedia(q).matches);
  React.useEffect(()=>{const mq=window.matchMedia(q);const h=e=>setM(e.matches);mq.addEventListener('change',h);return()=>mq.removeEventListener('change',h)},[q]);
  return m;
}
function Nav({page,go,t,lang,setLang}){
  const items=['home','story','schedule','photos'];const mob=useIsMobile();
  const link=k=><button key={k} onClick={()=>go(k)} style={{background:'none',border:0,padding:mob?'12px 4px':'6px 0',cursor:'pointer',font:'600 '+(mob?11:12)+'px var(--font-sans)',letterSpacing:mob?'.14em':'var(--ls-label)',textTransform:'uppercase',whiteSpace:'nowrap',color:page===k?'var(--accent-primary)':'var(--text-strong)',borderBottom:'2px solid '+(page===k?'var(--accent-primary)':'transparent')}}>{t.nav[k]}</button>;
  // Phone: compact top bar + bottom tab bar (thumb reach, no horizontal overflow whatever the language).
  if(mob) return <>
    <header style={{position:'sticky',top:0,zIndex:10,background:'color-mix(in srgb, var(--bg-page) 94%, transparent)',backdropFilter:'blur(8px)',borderBottom:'1px solid var(--sand)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,padding:'10px 12px 10px 16px'}}>
        <button onClick={()=>go('home')} style={{background:'none',border:0,cursor:'pointer',font:'28px/1 var(--font-script)',color:'var(--accent-primary)',padding:0,whiteSpace:'nowrap',minWidth:0}}>Linh &amp; Huy</button>
        <LangToggle lang={lang} setLang={setLang}/>
      </div>
    </header>
    <TabBar items={[...items,'rsvp']} page={page} go={go} t={t}/>
  </>;
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
const TAB_ICONS={
  home:<><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></>,
  story:<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>,
  schedule:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></>,
  photos:<><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></>,
  rsvp:<><rect x="3" y="6" width="18" height="13" rx="2"/><path d="m4 7 8 6 8-6"/></>,
};
function TabBar({items,page,go,t}){
  return <nav aria-label="Menu" className="lh-tabs">
    <style>{`:root{--bottom-nav:64px}
body{padding-bottom:calc(var(--bottom-nav) + env(safe-area-inset-bottom))}
.lh-tabs{position:fixed;left:0;right:0;bottom:0;z-index:20;display:grid;grid-template-columns:repeat(${items.length},1fr);height:var(--bottom-nav);padding:0 4px env(safe-area-inset-bottom);background:color-mix(in srgb,var(--bg-page) 94%,transparent);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-top:1px solid var(--sand);box-shadow:0 -6px 20px -14px rgba(59,23,48,.35)}
.lh-tab{all:unset;box-sizing:border-box;cursor:pointer;min-width:0;display:grid;justify-items:center;align-content:center;gap:3px;color:var(--text-muted);-webkit-tap-highlight-color:transparent}
.lh-tab-ico{width:52px;height:28px;border-radius:999px;display:flex;align-items:center;justify-content:center;transition:background var(--dur-base) var(--ease-out),color var(--dur-base)}
.lh-tab-lbl{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:600 10.5px/1.2 var(--font-sans);letter-spacing:.01em}
.lh-tab[aria-current=page]{color:var(--accent-primary)}
.lh-tab[aria-current=page] .lh-tab-ico{background:var(--lacquer-50)}
.lh-tab.cta{color:var(--accent-primary)}
.lh-tab.cta .lh-tab-ico{background:var(--accent-primary);color:var(--paper);box-shadow:var(--shadow-lift)}
.lh-tab.cta[aria-current=page] .lh-tab-ico{background:var(--accent-primary-hover)}
.lh-tab:active .lh-tab-ico{transform:scale(.92)}
.lh-tab:focus-visible .lh-tab-ico{outline:2px solid var(--focus-ring)}`}</style>
    {items.map(k=><button key={k} type="button" className={'lh-tab'+(k==='rsvp'?' cta':'')} aria-current={page===k?'page':undefined} onClick={()=>go(k)}>
      <span className="lh-tab-ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={page===k?2.2:1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{TAB_ICONS[k]}</svg></span>
      <span className="lh-tab-lbl">{(t.navShort||{})[k]||t.nav[k]}</span>
    </button>)}
  </nav>;
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
Object.assign(window,{useIsMobile,Nav,TabBar,Footer,Photo,LangToggle,StyleSwitch});
