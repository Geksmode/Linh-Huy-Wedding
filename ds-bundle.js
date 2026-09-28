/* @ds-bundle: {"format":4,"namespace":"LinhHuyWeddingDesignSystem_c04c82","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Badge","sourcePath":"components/content/Badge.jsx"},{"name":"Countdown","sourcePath":"components/content/Countdown.jsx"},{"name":"Divider","sourcePath":"components/content/Divider.jsx"},{"name":"EventCard","sourcePath":"components/content/EventCard.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"ChoiceGroup","sourcePath":"components/forms/ChoiceGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"TextField","sourcePath":"components/forms/TextField.jsx"},{"name":"Dialog","sourcePath":"components/overlay/Dialog.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"6c3570a38811","components/content/Badge.jsx":"1c52835ab42b","components/content/Countdown.jsx":"cb1665b963b1","components/content/Divider.jsx":"eee39374fee3","components/content/EventCard.jsx":"e5e823f89bac","components/content/SectionHeading.jsx":"edd6e4347870","components/forms/ChoiceGroup.jsx":"c08f50d829b9","components/forms/Select.jsx":"410d86fa57fc","components/forms/TextField.jsx":"30eb2f5f0d7e","components/overlay/Dialog.jsx":"71b11dce938b","ui_kits/website/Home.jsx":"97e9b6a56ca2","ui_kits/website/Nav.jsx":"140ad1890417","ui_kits/website/Rsvp.jsx":"a71c04c89e71","ui_kits/website/Schedule.jsx":"cf36d0b03277","ui_kits/website/Story.jsx":"f7762025a522","ui_kits/website/config.js":"8117ae4344c6","ui_kits/website/strings.js":"4968348baee8"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LinhHuyWeddingDesignSystem_c04c82 = window.LinhHuyWeddingDesignSystem_c04c82 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
const tones = {
  primary: {
    bg: 'var(--accent-primary)',
    fg: 'var(--paper)',
    bd: 'var(--accent-primary)',
    hover: 'var(--accent-primary-hover)'
  },
  sun: {
    bg: 'var(--accent-sun)',
    fg: 'var(--plum-ink)',
    bd: 'var(--accent-sun)',
    hover: 'var(--marigold-500)'
  },
  secondary: {
    bg: 'transparent',
    fg: 'var(--plum-ink)',
    bd: 'var(--plum-ink)',
    hover: 'var(--blush)'
  },
  ghost: {
    bg: 'transparent',
    fg: 'var(--accent-primary)',
    bd: 'transparent',
    hover: 'var(--lacquer-50)'
  }
};
const sizes = {
  sm: {
    h: 36,
    px: 16,
    fs: 11
  },
  md: {
    h: 48,
    px: 24,
    fs: 12
  },
  lg: {
    h: 60,
    px: 32,
    fs: 13
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  type = 'button',
  style
}) {
  const [hov, setHov] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const t = tones[variant] || tones.primary;
  const s = sizes[size] || sizes.md;
  const filled = variant === 'primary' || variant === 'sun';
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHov(true),
    onMouseLeave: () => {
      setHov(false);
      setDown(false);
    },
    onMouseDown: () => setDown(true),
    onMouseUp: () => setDown(false),
    style: {
      height: s.h,
      padding: `0 ${s.px}px`,
      width: fullWidth ? '100%' : undefined,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      background: hov && !disabled ? filled ? t.hover : t.hover : t.bg,
      borderColor: hov && !disabled && filled ? t.hover : t.bd,
      borderWidth: 'var(--border-bold)',
      borderStyle: 'solid',
      color: t.fg,
      borderRadius: 'var(--radius-pill)',
      font: `600 ${s.fs}px var(--font-sans)`,
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transform: down ? 'scale(.97)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/content/Badge.jsx
try { (() => {
const map = {
  lacquer: ['var(--lacquer-50)', 'var(--lacquer-700)'],
  marigold: ['var(--marigold-50)', 'var(--marigold-700)'],
  lotus: ['var(--lotus-50)', 'var(--lotus-700)'],
  jade: ['var(--jade-50)', 'var(--jade-700)'],
  plum: ['var(--plum-ink)', 'var(--paper)']
};
function Badge({
  tone = 'marigold',
  children
}) {
  const [bg, fg] = map[tone] || map.marigold;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      height: 26,
      padding: '0 12px',
      borderRadius: 'var(--radius-pill)',
      background: bg,
      color: fg,
      font: '600 11px var(--font-sans)',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap'
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Badge.jsx", error: String((e && e.message) || e) }); }

// components/content/Countdown.jsx
try { (() => {
function Countdown({
  date,
  tone = 'default',
  labels = ['days', 'hours', 'minutes', 'seconds']
}) {
  const target = new Date(date).getTime();
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  let d = Math.max(0, target - now);
  const parts = [['days', 864e5], ['hours', 36e5], ['minutes', 6e4], ['seconds', 1e3]].map(([l, ms]) => {
    const v = Math.floor(d / ms);
    d -= v * ms;
    return [l, v];
  });
  const inv = tone === 'inverse';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center'
    }
  }, parts.map(([k, v], i) => {
    const l = labels[i] || k;
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        minWidth: 92,
        padding: '16px 10px 14px',
        borderRadius: 'var(--radius-arch)',
        background: inv ? 'rgba(253,245,232,.1)' : 'var(--tile-' + (i + 1) + ')',
        border: '1px solid var(--tile-border)',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '500 44px/1 var(--font-serif)',
        color: inv ? 'var(--mango-300)' : 'var(--text-strong)',
        fontVariantNumeric: 'tabular-nums'
      }
    }, String(v).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 10px var(--font-sans)',
        letterSpacing: 'var(--ls-label)',
        textTransform: 'uppercase',
        color: inv ? 'var(--paper)' : 'var(--text-muted)',
        marginTop: 8
      }
    }, l));
  }));
}
Object.assign(__ds_scope, { Countdown });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Countdown.jsx", error: String((e && e.message) || e) }); }

// components/content/Divider.jsx
try { (() => {
function Divider({
  variant = 'dots',
  color = 'var(--sand)'
}) {
  const line = /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 1,
      background: color
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    role: "separator",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      width: '100%'
    }
  }, line, variant === 'diamond' ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 9,
      height: 9,
      background: 'var(--gold-500)',
      transform: 'rotate(45deg)'
    }
  }) : variant === 'dots' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, ['lacquer', 'marigold', 'mango', 'lotus', 'jade'].map(c => /*#__PURE__*/React.createElement("span", {
    key: c,
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: `var(--${c}-500)`
    }
  }))) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: '36px/1 var(--font-script)',
      color: 'var(--accent-primary)'
    }
  }, "&"), line);
}
Object.assign(__ds_scope, { Divider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Divider.jsx", error: String((e && e.message) || e) }); }

// components/content/EventCard.jsx
try { (() => {
const hues = {
  lacquer: ['var(--lacquer-500)', 'var(--mango-300)'],
  marigold: ['var(--marigold-500)', 'var(--plum-ink)'],
  lotus: ['var(--lotus-300)', 'var(--lacquer-700)'],
  jade: ['var(--jade-500)', 'var(--mango-300)'],
  hibiscus: ['var(--hibiscus-500)', 'var(--paper)'],
  cinnabar: ['var(--cinnabar-500)', 'var(--gold-300)'],
  gold: ['var(--gold-500)', 'var(--white)']
};
function EventCard({
  time,
  title,
  place,
  address,
  note,
  hue = 'lacquer',
  children
}) {
  const [bg, fg] = hues[hue] || hues.lacquer;
  return /*#__PURE__*/React.createElement("article", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-paper)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateRows: 'auto 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      color: fg,
      borderRadius: '0 0 50% 50% / 0 0 28px 28px',
      padding: '22px 24px 30px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: (String(time).length > 6 ? '500 28px/1' : '500 36px/1') + ' var(--font-serif)',
      whiteSpace: 'nowrap'
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 26px',
      display: 'grid',
      gap: 8,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--fs-display-sm)/1.1 var(--font-display)',
      color: 'var(--text-strong)'
    }
  }, title), place && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 12px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--accent-primary)'
    }
  }, place), address && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 16px/1.45 var(--font-serif)',
      color: 'var(--text-muted)'
    }
  }, address), note && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'italic 16px/1.45 var(--font-serif)',
      color: 'var(--text-body)'
    }
  }, note), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      display: 'flex',
      justifyContent: 'center',
      gap: 8
    }
  }, children)));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/EventCard.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
function SectionHeading({
  eyebrow,
  title,
  script,
  align = 'center',
  tone = 'default'
}) {
  const inv = tone === 'inverse';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 12,
      textAlign: align,
      justifyItems: align === 'center' ? 'center' : 'start'
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: inv ? 'var(--mango-300)' : 'var(--accent-primary)'
    }
  }, eyebrow), script && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '56px/0.9 var(--font-script)',
      color: inv ? 'var(--lotus-300)' : 'var(--accent-bold)',
      marginBottom: -18
    }
  }, script), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--fs-display-lg)/var(--lh-tight) var(--font-display)',
      letterSpacing: 'var(--ls-display)',
      color: inv ? 'var(--paper)' : 'var(--text-strong)',
      textWrap: 'balance'
    }
  }, title));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/forms/ChoiceGroup.jsx
try { (() => {
function ChoiceGroup({
  label,
  options = [],
  value,
  onChange,
  multiple = false,
  layout = 'chips'
}) {
  const [inner, setInner] = React.useState(multiple ? [] : null);
  const cur = value !== undefined ? value : inner;
  const isOn = v => multiple ? (cur || []).includes(v) : cur === v;
  const pick = v => {
    const next = multiple ? isOn(v) ? cur.filter(x => x !== v) : [...(cur || []), v] : v;
    setInner(next);
    onChange && onChange(next);
  };
  const chips = layout === 'chips';
  return /*#__PURE__*/React.createElement("fieldset", {
    style: {
      border: 0,
      padding: 0,
      margin: 0,
      display: 'grid',
      gap: 10
    }
  }, label && /*#__PURE__*/React.createElement("legend", {
    style: {
      font: '600 11px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)',
      marginBottom: 10,
      padding: 0
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: chips ? 'row' : 'column',
      flexWrap: 'wrap',
      gap: chips ? 10 : 12
    }
  }, options.map(o => {
    const v = typeof o === 'string' ? o : o.value;
    const l = typeof o === 'string' ? o : o.label;
    const on = isOn(v);
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      type: "button",
      role: multiple ? 'checkbox' : 'radio',
      "aria-checked": on,
      onClick: () => pick(v),
      style: chips ? {
        height: 44,
        padding: '0 20px',
        borderRadius: 'var(--radius-pill)',
        border: 'var(--border-bold) solid ' + (on ? 'var(--accent-primary)' : 'var(--border-soft)'),
        background: on ? 'var(--accent-primary)' : 'var(--surface-card)',
        color: on ? 'var(--paper)' : 'var(--text-strong)',
        font: '500 15px var(--font-sans)',
        cursor: 'pointer',
        transition: 'all var(--dur-fast) var(--ease-out)'
      } : {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'none',
        border: 0,
        padding: 0,
        cursor: 'pointer',
        font: '400 18px var(--font-serif)',
        color: 'var(--text-strong)',
        textAlign: 'left'
      }
    }, !chips && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        height: 22,
        flex: 'none',
        borderRadius: multiple ? 6 : '50%',
        border: 'var(--border-bold) solid ' + (on ? 'var(--accent-primary)' : 'var(--taupe)'),
        background: on ? 'var(--accent-primary)' : 'var(--surface-card)',
        boxShadow: on ? 'inset 0 0 0 3px var(--surface-card)' : 'none'
      }
    }), l);
  })));
}
Object.assign(__ds_scope, { ChoiceGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ChoiceGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  defaultValue,
  onChange,
  name
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 11px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", {
    name: name,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    style: {
      appearance: 'none',
      width: '100%',
      height: 52,
      padding: '0 44px 0 16px',
      font: '400 18px var(--font-serif)',
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: 'var(--border-bold) solid var(--border-soft)',
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      cursor: 'pointer'
    }
  }, options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 18,
      top: '50%',
      width: 8,
      height: 8,
      borderRight: '2px solid var(--accent-primary)',
      borderBottom: '2px solid var(--accent-primary)',
      transform: 'translateY(-70%) rotate(45deg)',
      pointerEvents: 'none'
    }
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/TextField.jsx
try { (() => {
function TextField({
  label,
  placeholder,
  value,
  defaultValue,
  onChange,
  helper,
  error,
  multiline = false,
  rows = 3,
  type = 'text',
  name
}) {
  const [focus, setFocus] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const bd = error ? 'var(--danger)' : focus ? 'var(--accent-warm)' : 'var(--border-soft)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 11px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement(Tag, {
    name: name,
    type: multiline ? undefined : type,
    rows: multiline ? rows : undefined,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      font: '400 18px/1.4 var(--font-serif)',
      color: 'var(--text-strong)',
      background: 'var(--surface-card)',
      border: 'var(--border-bold) solid ' + bd,
      borderRadius: 'var(--radius-md)',
      padding: multiline ? '14px 16px' : '0 16px',
      height: multiline ? undefined : 52,
      resize: 'vertical',
      outline: 'none',
      boxShadow: focus ? '0 0 0 4px var(--marigold-50)' : 'none',
      transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)'
    }
  }), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 14px var(--font-sans)',
      color: error ? 'var(--danger)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/TextField.jsx", error: String((e && e.message) || e) }); }

// components/overlay/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  onClose,
  title,
  script,
  children,
  actions,
  inline = false
}) {
  if (!open) return null;
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      width: 'min(480px,100%)',
      background: 'var(--paper)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lift)',
      padding: '36px 32px 28px',
      textAlign: 'center',
      position: 'relative',
      display: 'grid',
      gap: 14
    }
  }, onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 36,
      height: 36,
      borderRadius: '50%',
      border: 0,
      background: 'var(--blush)',
      color: 'var(--plum-ink)',
      font: '400 22px/1 var(--font-serif)',
      cursor: 'pointer'
    }
  }, "\xD7"), script && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '52px/0.9 var(--font-script)',
      color: 'var(--accent-primary)'
    }
  }, script), title && /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--fs-display-sm)/1.1 var(--font-display)',
      color: 'var(--text-strong)'
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 18px/1.55 var(--font-serif)',
      color: 'var(--text-body)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'center',
      marginTop: 6,
      flexWrap: 'wrap'
    }
  }, actions));
  if (inline) return panel;
  return /*#__PURE__*/React.createElement("div", {
    onClick: e => {
      if (e.target === e.currentTarget && onClose) onClose();
    },
    style: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(36,16,30,.55)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 100
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/overlay/Dialog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
function Home({
  go,
  t,
  theme
}) {
  const trad = theme === "traditional";
  const h = t.home;
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: trad ? 'var(--cinnabar-500)' : 'var(--lacquer-500)',
      color: 'var(--paper)',
      padding: trad ? '80px 24px 88px' : '96px 24px 0',
      textAlign: 'center'
    }
  }, trad && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 88,
      height: 88,
      margin: '0 auto 22px',
      borderRadius: '50%',
      border: '2px solid var(--gold-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '44px/1 serif',
      color: 'var(--gold-300)'
    }
  }, "\u56CD"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 12px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: trad ? 'var(--gold-300)' : 'var(--mango-300)'
    }
  }, h.eyebrow), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '18px 0 0',
      font: 'var(--fs-script-xl)/0.95 var(--font-script)',
      color: trad ? 'var(--gold-300)' : 'var(--mango-300)',
      fontWeight: 400
    }
  }, "Linh & Huy"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '18px auto 0',
      font: 'var(--fs-display-md)/1.1 var(--font-display)',
      maxWidth: 760
    }
  }, h.are, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: trad ? 'var(--gold-300)' : 'var(--lotus-300)'
    }
  }, h.married)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 28px var(--font-serif)',
      marginTop: 20,
      color: 'var(--paper)'
    }
  }, h.date), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginTop: 32,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "sun",
    size: "lg",
    onClick: () => go('rsvp')
  }, h.rsvp), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    style: {
      color: 'var(--paper)'
    },
    onClick: () => go('schedule')
  }, h.sched)), !trad && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 0,
      marginTop: 64,
      height: 200
    }
  }, [['--marigold-500', 70], ['--lotus-500', 100], ['--mango-500', 85], ['--hibiscus-500', 60], ['--jade-500', 90], ['--terracotta-500', 75]].map(([c, ht], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      maxWidth: 200,
      height: ht + '%',
      background: 'var(' + c + ')',
      borderRadius: 'var(--radius-arch)'
    }
  })))), /*#__PURE__*/React.createElement(Families, {
    f: h.families,
    trad: trad
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 24px 80px',
      display: 'grid',
      gap: 32,
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: h.countEyebrow,
    title: h.countTitle
  }), /*#__PURE__*/React.createElement(Countdown, {
    date: "2026-10-24T15:00:00+07:00",
    labels: h.units
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 24px 96px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Photo, {
    label: h.photos[0],
    src: "../../assets/photos/studio-white.jpg",
    pos: "50% 25%",
    style: {
      height: 420,
      borderRadius: 'var(--radius-arch)'
    }
  }), /*#__PURE__*/React.createElement(Photo, {
    label: h.photos[1],
    src: "../../assets/photos/vogue-hearts.jpg",
    pos: "50% 40%",
    style: {
      height: 420,
      borderRadius: 'var(--radius-lg)'
    }
  }), /*#__PURE__*/React.createElement(Photo, {
    label: h.photos[2],
    src: "../../assets/photos/candlelight.jpg",
    pos: "50% 45%",
    style: {
      height: 420,
      borderRadius: 'var(--radius-arch)'
    }
  }))));
}
function Families({
  f,
  trad
}) {
  const lab = {
    font: '600 12px var(--font-sans)',
    letterSpacing: 'var(--ls-label)',
    textTransform: 'uppercase',
    color: 'var(--accent-primary)'
  };
  const side = (title, parents, addr) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 6,
      justifyItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: lab
  }, title), parents.map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    style: {
      font: '400 var(--fs-body-lg)/1.35 var(--font-serif)',
      color: 'var(--text-strong)'
    }
  }, p)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'italic var(--fs-body-sm)/1.45 var(--font-serif)',
      color: 'var(--text-muted)',
      maxWidth: 260
    }
  }, addr));
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 24px',
      display: 'grid',
      gap: 36,
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: lab
  }, f.eyebrow), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 4,
      justifyItems: 'center',
      textAlign: 'center',
      marginTop: -16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fs-script-md)/1.1 var(--font-script)',
      color: 'var(--accent-primary)'
    }
  }, f.groom), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '40px/1 var(--font-script)',
      color: 'var(--accent-warm)'
    }
  }, "&"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--fs-script-md)/1.1 var(--font-script)',
      color: 'var(--accent-primary)'
    }
  }, f.bride)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 'min(640px,100%)'
    }
  }, /*#__PURE__*/React.createElement(Divider, {
    variant: trad ? 'diamond' : 'dots',
    color: trad ? 'var(--gold-300)' : undefined
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
      gap: 40,
      width: 'min(720px,100%)'
    }
  }, side(f.groomSide, f.groomParents, f.groomAddr), side(f.brideSide, f.brideParents, f.brideAddr)));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Nav.jsx
try { (() => {
function LangToggle({
  lang,
  setLang
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "group",
    "aria-label": "Language",
    style: {
      display: 'flex',
      background: 'var(--bg-alt)',
      borderRadius: 'var(--radius-pill)',
      padding: 3,
      gap: 2
    }
  }, [['vi', 'VI'], ['en', 'EN']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setLang(k),
    "aria-pressed": lang === k,
    style: {
      height: 30,
      minWidth: 40,
      padding: '0 10px',
      border: 0,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      font: '600 11px var(--font-sans)',
      letterSpacing: '.12em',
      background: lang === k ? 'var(--text-strong)' : 'transparent',
      color: lang === k ? 'var(--paper)' : 'var(--text-strong)',
      transition: 'background var(--dur-fast) var(--ease-out)'
    }
  }, l)));
}
function Nav({
  page,
  go,
  t,
  lang,
  setLang
}) {
  const items = ['home', 'story', 'schedule'];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'color-mix(in srgb, var(--bg-page) 92%, transparent)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--sand)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '0 auto',
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => go('home'),
    style: {
      background: 'none',
      border: 0,
      cursor: 'pointer',
      font: '40px/1 var(--font-script)',
      color: 'var(--accent-primary)',
      padding: 0
    }
  }, "Linh & Huy"), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 24,
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, items.map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => go(k),
    style: {
      background: 'none',
      border: 0,
      padding: '6px 0',
      cursor: 'pointer',
      font: '600 12px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: page === k ? 'var(--accent-primary)' : 'var(--text-strong)',
      borderBottom: '2px solid ' + (page === k ? 'var(--accent-primary)' : 'transparent')
    }
  }, t.nav[k])), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('rsvp')
  }, t.nav.rsvp), /*#__PURE__*/React.createElement(LangToggle, {
    lang: lang,
    setLang: setLang
  }))));
}
function Footer({
  t,
  theme
}) {
  const trad = theme === 'traditional';
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: trad ? 'var(--cinnabar-700)' : 'var(--plum-night)',
      color: 'var(--paper)',
      padding: '56px 24px',
      textAlign: 'center',
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '64px/1 var(--font-script)',
      color: trad ? 'var(--gold-300)' : 'var(--mango-300)'
    }
  }, "Linh & Huy"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 12px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: trad ? 'var(--cream)' : 'var(--lotus-300)'
    }
  }, t.footer));
}
function Photo({
  label,
  src,
  pos = 'center',
  style
}) {
  if (src) return /*#__PURE__*/React.createElement("div", {
    role: "img",
    "aria-label": label,
    style: {
      backgroundImage: 'url(' + src + ')',
      backgroundSize: 'cover',
      backgroundPosition: pos,
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'repeating-linear-gradient(135deg,var(--paper-2) 0 12px,var(--blush) 12px 24px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--cocoa)',
      font: '500 12px var(--font-sans)',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      ...style
    }
  }, label);
}
function StyleSwitch({
  theme,
  setTheme
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      left: 16,
      bottom: 16,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--white)',
      boxShadow: 'var(--shadow-lift)',
      borderRadius: 'var(--radius-pill)',
      padding: '6px 6px 6px 14px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 10px var(--font-sans)',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'var(--cocoa)'
    }
  }, "Style"), [['traditional', 'Traditional'], ['colorful', 'Colorful']].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setTheme(k),
    style: {
      height: 30,
      padding: '0 12px',
      border: 0,
      borderRadius: 'var(--radius-pill)',
      cursor: 'pointer',
      font: '600 11px var(--font-sans)',
      background: theme === k ? 'var(--plum-ink)' : 'transparent',
      color: theme === k ? 'var(--paper)' : 'var(--plum-ink)'
    }
  }, l)));
}
Object.assign(window, {
  Nav,
  Footer,
  Photo,
  LangToggle,
  StyleSwitch
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Rsvp.jsx
try { (() => {
function Rsvp({
  go,
  t,
  lang
}) {
  const r = t.rsvp;
  const [f, setF] = React.useState({
    name: '',
    email: '',
    attending: 'y',
    party: r.partyOpts[0],
    events: [],
    note: ''
  });
  const set = k => v => setF(p => ({
    ...p,
    [k]: v && v.target ? v.target.value : v
  }));
  const [status, setStatus] = React.useState('idle');
  const [nameErr, setNameErr] = React.useState('');
  const yes = f.attending === 'y';
  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim()) {
      setNameErr(r.nameReq);
      return;
    }
    setNameErr('');
    setStatus('sending');
    const row = {
      timestamp: new Date().toISOString(),
      name: f.name.trim(),
      email: f.email.trim(),
      attending: yes ? 'yes' : 'no',
      partySize: yes ? f.party : '',
      events: yes ? f.events.join(', ') : '',
      note: f.note.trim(),
      lang
    };
    try {
      if (window.RSVP_ENDPOINT) {
        await fetch(window.RSVP_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(row)
        });
      } else {
        console.warn('RSVP demo mode — set window.RSVP_ENDPOINT in config.js', row);
      }
      setStatus('done');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }
  return /*#__PURE__*/React.createElement("main", {
    style: {
      background: 'var(--blush)',
      padding: '80px 24px 96px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: r.eyebrow,
    title: r.title
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    style: {
      maxWidth: 560,
      margin: '40px auto 0',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-paper)',
      padding: '36px 32px',
      display: 'grid',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement(TextField, {
    label: r.name,
    placeholder: "Nguy\u1EC5n Th\u1ECB Mai",
    value: f.name,
    onChange: set('name'),
    error: nameErr || undefined
  }), /*#__PURE__*/React.createElement(TextField, {
    label: r.email,
    type: "email",
    placeholder: "mai@example.com",
    value: f.email,
    onChange: set('email')
  }), /*#__PURE__*/React.createElement(ChoiceGroup, {
    label: r.attend,
    options: [{
      value: 'y',
      label: r.yes
    }, {
      value: 'n',
      label: r.no
    }],
    value: f.attending,
    onChange: set('attending')
  }), yes && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Select, {
    label: r.party,
    options: r.partyOpts,
    value: f.party,
    onChange: set('party')
  }), /*#__PURE__*/React.createElement(ChoiceGroup, {
    label: r.events,
    layout: "list",
    multiple: true,
    options: r.eventOpts,
    value: f.events,
    onChange: set('events')
  })), /*#__PURE__*/React.createElement(TextField, {
    label: r.note,
    multiline: true,
    rows: 3,
    placeholder: r.optional,
    value: f.note,
    onChange: set('note')
  }), status === 'error' && /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 15px var(--font-sans)',
      color: 'var(--danger)'
    }
  }, r.err), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    fullWidth: true,
    disabled: status === 'sending'
  }, status === 'sending' ? r.sending : yes ? r.send : r.sendNo)), /*#__PURE__*/React.createElement(Dialog, {
    open: status === 'done',
    onClose: () => setStatus('idle'),
    script: r.thanks,
    title: yes ? r.gotIt : r.miss,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      onClick: () => {
        setStatus('idle');
        go('schedule');
      }
    }, r.toSched), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setStatus('idle')
    }, r.close))
  }, yes ? r.yesMsg(f.name) : r.noMsg));
}
window.Rsvp = Rsvp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Rsvp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Schedule.jsx
try { (() => {
function Schedule({
  go,
  t,
  theme
}) {
  const s = t.sched;
  const trad = theme === 'traditional';
  const hues = trad ? [['cinnabar', 'gold', 'cinnabar'], ['cinnabar', 'gold', 'cinnabar', 'gold']] : [['lotus', 'marigold', 'terracotta'], ['lacquer', 'hibiscus', 'marigold', 'jade']];
  const tones = ['marigold', 'lotus'];
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '80px 24px 64px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: s.eyebrow,
    script: s.script,
    title: s.title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '28px auto 0',
      display: 'grid',
      gap: 6,
      justifyItems: 'center',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 11px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, s.venueLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 var(--fs-body-lg) var(--font-serif)',
      color: 'var(--text-strong)'
    }
  }, s.venue), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 var(--fs-body) var(--font-serif)',
      color: 'var(--text-muted)'
    }
  }, s.venueAddr)), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--content-max)',
      margin: '48px auto 0',
      display: 'grid',
      gap: 56
    }
  }, s.days.map((d, di) => /*#__PURE__*/React.createElement("div", {
    key: di,
    style: {
      display: 'grid',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 16,
      flexWrap: 'wrap',
      borderBottom: '1px solid var(--sand)',
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px var(--font-sans)',
      letterSpacing: 'var(--ls-label)',
      textTransform: 'uppercase',
      color: 'var(--accent-primary)'
    }
  }, d.label), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--fs-display-sm)/1.2 var(--font-display)',
      color: 'var(--text-strong)'
    }
  }, d.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))',
      gap: 20
    }
  }, d.events.map(([time, title, note], i) => /*#__PURE__*/React.createElement(EventCard, {
    key: i,
    time: time,
    title: title,
    note: note || undefined,
    hue: hues[di][i % hues[di].length]
  }))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: trad ? 'var(--cinnabar-700)' : 'var(--plum-night)',
      padding: '72px 24px',
      textAlign: 'center',
      display: 'grid',
      gap: 24,
      justifyItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    tone: "inverse",
    eyebrow: s.dressEyebrow,
    title: s.dressTitle
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 'var(--measure)',
      font: 'var(--fs-body-lg)/var(--lh-body) var(--font-serif)',
      color: 'var(--paper)'
    }
  }, s.dressBody), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, s.badges.map((b, i) => /*#__PURE__*/React.createElement(Badge, {
    key: b,
    tone: tones[i]
  }, b))), /*#__PURE__*/React.createElement(Button, {
    variant: "sun",
    onClick: () => go('rsvp')
  }, s.cta)));
}
window.Schedule = Schedule;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Schedule.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Story.jsx
try { (() => {
function Story({
  t,
  theme
}) {
  const s = t.story;
  const pics = [['../../assets/photos/photobooth.png', '50% 30%'], ['../../assets/photos/picnic-selfie.png', '50% 45%'], ['../../assets/photos/heart-frame.png', '50% 45%'], ['../../assets/photos/campfire.png', '45% 50%']];
  const colors = theme === 'traditional' ? ['--cinnabar-500', '--gold-500', '--cinnabar-500', '--gold-500'] : ['--marigold-500', '--lotus-500', '--jade-500', '--lacquer-500'];
  return /*#__PURE__*/React.createElement("main", {
    style: {
      padding: '80px 24px 96px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: s.eyebrow,
    script: s.script,
    title: s.title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 880,
      margin: '56px auto 0',
      display: 'grid',
      gap: 48
    }
  }, s.beats.map(([y, ti, b], i) => /*#__PURE__*/React.createElement("div", {
    key: y,
    style: {
      display: 'grid',
      gridTemplateColumns: i % 2 ? '1fr 280px' : '280px 1fr',
      gap: 40,
      alignItems: 'center'
    }
  }, i % 2 === 0 && /*#__PURE__*/React.createElement(Photo, {
    label: y,
    src: pics[i][0],
    pos: pics[i][1],
    style: {
      height: 300,
      borderRadius: 'var(--radius-arch)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: (y.length > 4 ? '500 36px/1.1' : '500 56px/1') + ' var(--font-serif)',
      color: 'var(' + colors[i] + ')'
    }
  }, y), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      font: 'var(--fs-display-sm)/1.2 var(--font-display)',
      color: 'var(--text-strong)'
    }
  }, ti), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--fs-body-lg)/var(--lh-body) var(--font-serif)',
      color: 'var(--text-body)'
    }
  }, b)), i % 2 === 1 && /*#__PURE__*/React.createElement(Photo, {
    label: y,
    src: pics[i][0],
    pos: pics[i][1],
    style: {
      height: 300,
      borderRadius: 'var(--radius-arch)'
    }
  }))), /*#__PURE__*/React.createElement(Divider, {
    variant: "ampersand"
  })));
}
window.Story = Story;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Story.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/config.js
try { (() => {
// Google Apps Script Web App URL (see google-sheet/README.md).
// Leave empty to run the RSVP form in demo mode (nothing is saved).
window.RSVP_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyjVq7BWBmya3jN-cfSX2SJMsBFQUxT2QLbGgy7eqkHpgZZF9h9m1UKptG-xkWfqK6R/exec';
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/config.js", error: String((e && e.message) || e) }); }

// ui_kits/website/strings.js
try { (() => {
window.STRINGS = {
  en: {
    nav: {
      home: 'Home',
      story: 'Our story',
      schedule: 'Schedule',
      rsvp: 'RSVP'
    },
    footer: '24 – 25 · 10 · 2026 — Phủ Lý, Ninh Bình',
    home: {
      eyebrow: 'Together with their families',
      are: 'are getting',
      married: 'married',
      date: 'Saturday 24 & Sunday 25 October 2026 · Phủ Lý, Ninh Bình',
      rsvp: 'RSVP by 1 October',
      sched: 'See the schedule',
      families: {
        eyebrow: 'The wedding of',
        groom: 'Lê Thanh Huy',
        bride: 'Đỗ Trang Linh',
        groomSide: "Groom's family",
        brideSide: "Bride's family",
        groomParents: ['Mr Lê Thanh Hùng', 'Mrs Nguyễn Thị Thủy'],
        brideParents: ['Mr Đỗ Quốc Toản', 'Mrs Nguyễn Thị Mai'],
        groomAddr: '216 Route de la Brauderie, France',
        brideAddr: '550 Trần Hưng Đạo Street, Phủ Lý Ward, Ninh Bình'
      },
      countEyebrow: 'Counting down',
      countTitle: 'Until we say I do',
      units: ['days', 'hours', 'minutes', 'seconds'],
      photos: ['Linh and Huy in the studio', 'Linh and Huy with a magazine of hearts', 'Linh and Huy by candlelight']
    },
    story: {
      eyebrow: 'How it began',
      script: 'our',
      title: 'Story',
      beats: [['2023', 'We met in South Korea', 'Two people far from home, Linh from Vietnam and Huy from France, crossed paths in South Korea.'], ['France · Korea', 'Love across the distance', 'For a while, our love lived between France and Korea: different time zones, late-night calls and a lot of counting the days.'], ['Together', 'Reunited in Korea', 'Until the distance ended and we found each other again in Korea.'], ['2026', 'Now, for always', 'A love story between France and Korea, celebrated with our families in Phủ Lý.']]
    },
    sched: {
      eyebrow: '24 – 25 October 2026 · Phủ Lý, Ninh Bình',
      venueLabel: 'Venue',
      venue: "Bride's family home",
      venueAddr: '550 Trần Hưng Đạo Street, Phủ Lý Ward, Ninh Bình, Vietnam',
      script: 'the',
      title: 'Wedding weekend',
      days: [{
        label: 'Saturday · 24 October',
        title: 'Engagement Ceremony',
        events: [['15:00–16:00', 'Bride-Receiving Ceremony', 'Formal Request to Take the Bride'], ['16:00–18:00', 'Engagement Reception', "Groom's family joins the celebration"], ['18:00–20:00', 'Family gathering & socializing', '']]
      }, {
        label: 'Sunday · 25 October',
        title: 'Wedding Ceremony',
        events: [['09:30–10:00', "Groom's family arrive", ''], ['10:00–11:00', 'Main Wedding Ceremony', ''], ['11:00–12:00', 'Wedding reception', ''], ['12:00–15:00', 'Event ends', '']]
      }],
      dressEyebrow: 'Dress code',
      dressTitle: 'Wear your brightest colors',
      dressBody: 'Áo dài warmly encouraged. Marigold, pink, red — the louder the better.',
      badges: ['Festive', 'Áo dài welcome'],
      cta: 'RSVP now'
    },
    rsvp: {
      eyebrow: 'Kindly reply by 1 October',
      title: 'Will you join us?',
      name: 'Full name',
      email: 'Email',
      attend: 'Attendance',
      yes: 'Joyfully accepts',
      no: 'Regretfully declines',
      party: 'Party size',
      partyOpts: ['Just me', '2 guests', '3 guests', '4 guests'],
      events: 'Which events?',
      eventOpts: ['Engagement Ceremony · Sat 24', 'Wedding Ceremony · Sun 25'],
      nameReq: 'Please enter your name',
      sending: 'Sending…',
      err: 'Something went wrong. Please try again.',
      note: 'A note for Linh & Huy',
      optional: 'Optional',
      send: 'Send RSVP',
      sendNo: 'Send regrets',
      thanks: 'Thank you',
      gotIt: 'We got your RSVP',
      miss: 'We will miss you',
      yesMsg: n => (n ? n.split(' ').slice(-1)[0] + ', see' : 'See') + ' you in Phủ Lý.',
      noMsg: 'Thank you for letting us know. We will raise a glass for you.',
      toSched: 'See the schedule',
      close: 'Close'
    }
  },
  vi: {
    nav: {
      home: 'Trang chủ',
      story: 'Chuyện tình',
      schedule: 'Lịch trình',
      rsvp: 'Xác nhận'
    },
    footer: '24 – 25 · 10 · 2026 — Phủ Lý, Ninh Bình',
    home: {
      eyebrow: 'Cùng gia đình hai bên',
      are: 'sắp',
      married: 'về chung một nhà',
      date: 'Thứ bảy 24 & Chủ nhật 25 tháng 10 năm 2026 · Phủ Lý, Ninh Bình',
      rsvp: 'Xác nhận trước 1/10',
      sched: 'Xem lịch trình',
      families: {
        eyebrow: 'Lễ thành hôn của',
        groom: 'Lê Thanh Huy',
        bride: 'Đỗ Trang Linh',
        groomSide: 'Nhà Trai',
        brideSide: 'Nhà Gái',
        groomParents: ['Ông Lê Thanh Hùng', 'Bà Nguyễn Thị Thủy'],
        brideParents: ['Ông Đỗ Quốc Toản', 'Bà Nguyễn Thị Mai'],
        groomAddr: '216 Route de la Brauderie, Pháp',
        brideAddr: '550 Đường Trần Hưng Đạo, P. Phủ Lý, Ninh Bình'
      },
      countEyebrow: 'Đếm ngược',
      countTitle: 'Đến ngày chung đôi',
      units: ['ngày', 'giờ', 'phút', 'giây'],
      photos: ['Linh và Huy trong studio', 'Linh và Huy với tạp chí trái tim', 'Linh và Huy dưới ánh nến']
    },
    story: {
      eyebrow: 'Ngày ấy bắt đầu',
      script: 'chuyện',
      title: 'Của chúng mình',
      beats: [['2023', 'Gặp nhau ở Hàn Quốc', 'Hai người xa nhà, Linh từ Việt Nam, Huy từ Pháp, đã gặp nhau ở Hàn Quốc.'], ['Pháp · Hàn', 'Yêu xa', 'Có một thời gian, tình yêu của chúng mình nằm giữa Pháp và Hàn Quốc: lệch múi giờ, những cuộc gọi đêm khuya và bao ngày đếm ngược.'], ['Bên nhau', 'Gặp lại ở Hàn Quốc', 'Cho đến khi khoảng cách không còn, và chúng mình lại được ở bên nhau tại Hàn Quốc.'], ['2026', 'Từ nay, mãi mãi', 'Một chuyện tình giữa Pháp và Hàn Quốc, về chung một nhà cùng gia đình ở Phủ Lý.']]
    },
    sched: {
      eyebrow: '24 – 25 tháng 10 năm 2026 · Phủ Lý, Ninh Bình',
      venueLabel: 'Địa điểm tổ chức',
      venue: 'Tư gia nhà gái',
      venueAddr: '550 Đường Trần Hưng Đạo, P. Phủ Lý, Ninh Bình, Việt Nam',
      script: 'hai ngày',
      title: 'Vui chung đôi',
      days: [{
        label: 'Thứ bảy · 24 tháng 10',
        title: 'Lễ Đám Hỏi',
        events: [['15:00–16:00', 'Lễ xin dâu', 'Nhà trai xin phép rước dâu'], ['16:00–18:00', 'Tiệc đám hỏi', 'Nhà trai cùng chung vui'], ['18:00–20:00', 'Gia đình quây quần, giao lưu', '']]
      }, {
        label: 'Chủ nhật · 25 tháng 10',
        title: 'Lễ Vu Quy',
        events: [['09:30–10:00', 'Nhà trai đến', ''], ['10:00–11:00', 'Lễ thành hôn', ''], ['11:00–12:00', 'Tiệc cưới', ''], ['12:00–15:00', 'Kết thúc', '']]
      }],
      dressEyebrow: 'Trang phục',
      dressTitle: 'Hãy mặc thật rực rỡ',
      dressBody: 'Rất mong được thấy mọi người diện áo dài. Vàng cúc, hồng, đỏ — càng tươi càng vui.',
      badges: ['Rực rỡ', 'Chào đón áo dài'],
      cta: 'Xác nhận ngay'
    },
    rsvp: {
      eyebrow: 'Vui lòng phản hồi trước 1/10',
      title: 'Bạn sẽ đến chung vui chứ?',
      name: 'Họ và tên',
      email: 'Email',
      attend: 'Tham dự',
      yes: 'Chắc chắn sẽ đến',
      no: 'Rất tiếc không đến được',
      party: 'Số người',
      partyOpts: ['Chỉ mình tôi', '2 người', '3 người', '4 người'],
      events: 'Bạn tham dự phần nào?',
      eventOpts: ['Lễ Đám Hỏi · Thứ bảy 24', 'Lễ Vu Quy · Chủ nhật 25'],
      nameReq: 'Vui lòng nhập họ tên',
      sending: 'Đang gửi…',
      err: 'Có lỗi xảy ra. Vui lòng thử lại.',
      note: 'Lời nhắn cho Linh & Huy',
      optional: 'Không bắt buộc',
      send: 'Gửi xác nhận',
      sendNo: 'Gửi lời nhắn',
      thanks: 'Cảm ơn',
      gotIt: 'Đã nhận được xác nhận',
      miss: 'Chúng mình sẽ nhớ bạn',
      yesMsg: n => 'Hẹn gặp ' + (n ? n.split(' ').slice(-1)[0] + ' ' : 'bạn ') + 'ở Phủ Lý nhé!',
      noMsg: 'Cảm ơn bạn đã báo. Chúng mình sẽ nâng ly vì bạn.',
      toSched: 'Xem lịch trình',
      close: 'Đóng'
    }
  }
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/strings.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Countdown = __ds_scope.Countdown;

__ds_ns.Divider = __ds_scope.Divider;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.ChoiceGroup = __ds_scope.ChoiceGroup;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.Dialog = __ds_scope.Dialog;

})();
