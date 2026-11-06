/* Shared kit for the Ilm Class Notes kids stories: cut-paper drawing helpers, soft sound effects, and the chapter engine.
   A story page defines S (state), NAMES, SCENES (each {label, draw(), html(), act(a,el)}) and calls KIDS.start({key}). */
const $=(s,r=document)=>r.querySelector(s);
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- drawing kit ---------- */
const INK='#17142E',INK2='#2D2756',INK3='#4A4180',GOLD='#F2B544',IVORY='#F5E9C8',CLAY='#A2452E',RUG='#B23542',LEAF='#3F6A1E',SKYB='#7DB7C9';
let GID=0;
const sky=(...c)=>{const id='g'+(GID++);return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${c.map((x,i)=>`<stop offset="${i/(c.length-1)}" stop-color="${x}"/>`).join('')}</linearGradient></defs><rect width="800" height="500" fill="url(#${id})"/>`};
const ground=(fill=INK,y=446,b=18)=>`<path d="M0 ${y} Q400 ${y-b} 800 ${y} V500 H0Z" fill="${fill}"/>`;
const hills=(y,fill)=>`<path d="M0 ${y} L60 ${y-70} L120 ${y-30} L200 ${y-110} L270 ${y-50} L340 ${y-90} L420 ${y-30} L500 ${y-100} L580 ${y-40} L660 ${y-120} L730 ${y-60} L800 ${y-95} V500 H0Z" fill="${fill}"/>`;
const dune=(y,a,fill)=>`<path d="M0 ${y} Q220 ${y-a} 420 ${y-a*.3} T800 ${y-a*.5} V500 H0Z" fill="${fill}"/>`;
function person({x,y,h=110,fill=INK,sit=0,lean=0,hat=0}){
  const w=h*.2,r=h*.105,hh=sit?h*.62:h,sh=-hh+2.1*r;
  return `<g transform="translate(${x} ${y}) rotate(${lean})" fill="${fill}"><path d="M${-w*.75} ${sh+4} Q0 ${sh-8} ${w*.75} ${sh+4} L${sit?w*1.9:w*1.15} 0 H${sit?-w*1.9:-w*1.15}Z"/><circle cx="0" cy="${-hh+r}" r="${r}"/>${hat?`<path d="M${-r*1.2} ${-hh+r*.6} Q0 ${-hh-r*1.1} ${r*1.2} ${-hh+r*.6}Z"/>`:''}</g>`;
}
const camel=({x,y,s=1,flip=0,fill=INK,load=0})=>`<g transform="translate(${x} ${y}) scale(${flip?-s:s} ${s})" fill="${fill}" stroke="${fill}"><ellipse cx="0" cy="-54" rx="36" ry="18"/><ellipse cx="-4" cy="-72" rx="17" ry="15"/><path d="M28 -58 Q48 -66 46 -102" stroke-width="11" fill="none" stroke-linecap="round"/><ellipse cx="54" cy="-104" rx="13" ry="7"/><path d="M-26 -44 V0 M-14 -44 V0 M14 -44 V0 M26 -44 V0" stroke-width="6" stroke-linecap="round"/>${load?`<rect x="-30" y="-100" width="22" height="26" rx="4" fill="${load}" stroke="none"/><rect x="2" y="-100" width="22" height="26" rx="4" fill="${load}" stroke="none"/><path d="M-32 -88 H26" stroke="${CLAY}" stroke-width="3"/>`:''}</g>`;
const kaabah=({x,y,s=1})=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M50 -112 L74 -126 V-12 L50 0Z" fill="#2A2350"/><path d="M-50 -112 L-26 -126 H74 L50 -112Z" fill="#3B3070"/><rect x="-50" y="-112" width="100" height="112" fill="#0E0C1C"/><rect x="-50" y="-90" width="100" height="10" fill="${GOLD}"/><path d="M50 -90 L74 -104 V-94 L50 -80Z" fill="#C98F2B"/><rect x="8" y="-56" width="26" height="56" fill="#C98F2B"/></g>`;
const WING='M-18 -2 Q-9 -14 0 0 Q9 -14 18 -2 Q9 -6 0 5 Q-9 -6 -18 -2Z';
const bird=(x,y,s=1,fill=INK)=>`<path transform="translate(${x} ${y}) scale(${s})" d="${WING}" fill="${fill}"/>`;
const rnd=(()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647})();
const stars=n=>Array.from({length:n},()=>`<circle cx="${rnd()*800|0}" cy="${rnd()*260|0}" r="${(rnd()*1.6+.6).toFixed(1)}" fill="${IVORY}" opacity="${(rnd()*.6+.4).toFixed(2)}"/>`).join('');
const moon=(x,y,r=40,fill=IVORY)=>{const id='m'+(GID++);return `<mask id="${id}"><rect x="${x-r}" y="${y-r}" width="${r*2}" height="${r*2}" fill="#fff"/><circle cx="${x+r*.45}" cy="${y-r*.25}" r="${r*.9}" fill="#000"/></mask><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" mask="url(#${id})"/>`};
const sun=(x,y,r=46,fill='#FFE7A8')=>`<circle cx="${x}" cy="${y}" r="${r*1.8}" fill="${fill}" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const palm=(x,y,s=1,fill=INK)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><path d="M-5 0 Q-10 -60 4 -120 L12 -120 Q2 -60 7 0Z"/>${[[-70,-40],[-50,-80],[0,-95],[50,-80],[70,-40]].map(([dx,dy])=>`<path d="M8 -120 Q${dx/2} ${-120+dy/2-20} ${dx} ${-120-dy*-.2}" stroke="${fill}" stroke-width="12" fill="none" stroke-linecap="round"/>`).join('')}</g>`;
const house=(x,y,w=90,h=70,fill=INK,lit=0)=>`<rect x="${x}" y="${y-h}" width="${w}" height="${h+4}" fill="${fill}"/><rect x="${x-4}" y="${y-h-6}" width="${w+8}" height="8" rx="3" fill="${fill}"/>${lit?`<rect x="${x+w/2-9}" y="${y-h+16}" width="18" height="20" rx="3" fill="${GOLD}" opacity=".9"/>`:''}`;

/* ---------- sound: soft synthesised effects, only after a tap. No music. ---------- */
let AC=null,NB=null,OUT=null,soundOn=true;
function audio(){
  if(!soundOn)return null;
  try{
    if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();
      OUT=AC.createDynamicsCompressor();const m=AC.createGain();m.gain.value=.9;OUT.connect(m);m.connect(AC.destination);
      NB=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
    if(AC.state==='suspended')AC.resume();
    return AC}catch(e){return null}
}
function env(g,t,a,d,peak){g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function noise(at,{f=1000,f2,q=1,type='bandpass',a=.01,d=.2,g=.3}={}){const ac=audio();if(!ac)return;const t=ac.currentTime+at;
  const s=ac.createBufferSource();s.buffer=NB;s.loop=true;const fl=ac.createBiquadFilter();fl.type=type;fl.frequency.setValueAtTime(f,t);fl.Q.value=q;
  if(f2)fl.frequency.exponentialRampToValueAtTime(f2,t+a+d);
  const gn=ac.createGain();env(gn,t,a,d,g);s.connect(fl);fl.connect(gn);gn.connect(OUT);s.start(t,Math.random());s.stop(t+a+d+.05)}
function tone(at,{f=80,f2,type='sine',a=.005,d=.25,g=.4}={}){const ac=audio();if(!ac)return;const t=ac.currentTime+at;
  const o=ac.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+a+d);
  const gn=ac.createGain();env(gn,t,a,d,g);o.connect(gn);gn.connect(OUT);o.start(t);o.stop(t+a+d+.05)}
const SFX={
  step(at=0,g=.4){tone(at,{f:90,f2:42,d:.22,g});noise(at,{type:'lowpass',f:300,d:.12,g:g*.5})},
  steps(n,gap,g=.35,at=0){for(let i=0;i<n;i++)SFX.step(at+i*gap,g*(i%2?.8:1))},
  knock(at=0,g=.3){tone(at,{f:200,f2:120,d:.06,g});noise(at,{type:'lowpass',f:1200,d:.03,g:g*.5})},
  dull(at=0){tone(at,{f:110,f2:70,d:.16,g:.3})},
  ding(at=0){tone(at,{f:880,d:.5,g:.12});tone(at+.08,{f:1320,d:.5,g:.07})},
  swish(at=0){noise(at,{f:600,f2:2400,q:.8,a:.08,d:.22,g:.1})},
  sink(at=0){noise(at,{f:1800,f2:300,q:.9,a:.05,d:.5,g:.14})},
  wind(dur=3,g=.12,at=0){noise(at,{f:300,f2:700,q:1.2,a:dur*.4,d:dur*.6,g});noise(at+.2,{f:900,f2:400,q:2,a:dur*.5,d:dur*.5,g:g*.5})},
  sand(at=0,dur=1.2){noise(at,{type:'highpass',f:4000,f2:2500,a:.05,d:dur,g:.05})},
  blow(at=0){noise(at,{f:700,f2:300,q:.6,a:.05,d:.4,g:.12})},
  chirp(at=0){const f=2400+Math.random()*1400;tone(at,{f,f2:f*1.35,a:.01,d:.07,g:.05})},
  chirps(n,dur,at=0){for(let i=0;i<n;i++){const t=at+Math.random()*dur;SFX.chirp(t);if(Math.random()<.6)SFX.chirp(t+.11)}},
  door(at=0){tone(at,{f:140,f2:60,d:.2,g:.4});noise(at,{type:'lowpass',f:600,d:.15,g:.3})}
};

/* ---------- panel helpers ---------- */
const src=k=>`<span class="src" data-k="${k}">${{quran:"Qur'an",hadith:'Sahih hadith',sirah:'Sirah report',tafsir:'Tafsir'}[k]}</span>`;
const ask=q=>`<aside class="ask"><b>Ask them first</b><p>${q}</p></aside>`;
const K={cur:0};
const head=(place,title,...k)=>`<p class="kick"><span>${K.cur?'Chapter '+K.cur:'Start here'}</span><span>${place}</span>${k.map(src).join('')}</p><h2>${title}</h2>`;
const verse=(ar,mean,cite,extra='')=>`<div class="verse pop"><p class="ar" lang="ar">${ar}</p><p class="mean">${mean}</p>${extra}<p class="cite">${cite}</p></div>`;

/* ---------- engine ---------- */
const KIDS={start(cfg){
  const stage=$('#stage'),panel=$('#panel'),dots=$('#dots'),key=cfg.key;
  try{soundOn=localStorage.getItem(key+'-sound')!=='off'}catch(e){}
  const renderStage=()=>{const sc=SCENES[K.cur];stage.innerHTML=sc.draw();stage.setAttribute('aria-label',sc.label)};
  const renderPanel=()=>{
    const f=document.activeElement,k=f&&panel.contains(f)?[f.dataset.act,f.dataset.v]:null;
    panel.innerHTML=SCENES[K.cur].html()+`<div class="nav"><button class="btn alt" data-nav="-1" ${K.cur?'':'disabled'}>Back</button><button class="btn" data-nav="1">${K.cur===0?'Begin':K.cur===SCENES.length-1?'Notes for parents':'Next: '+NAMES[K.cur+1]}</button></div>`;
    if(k){const b=[...panel.querySelectorAll('[data-act]')].find(b=>b.dataset.act===k[0]&&b.dataset.v===k[1]&&!b.disabled);if(b)b.focus({preventScroll:true})}
  };
  const renderDots=()=>{dots.innerHTML=NAMES.map((n,i)=>`<button type="button" class="${i===K.cur?'on':i<K.cur?'done':''}" data-go="${i}" aria-label="${i?'Chapter '+i+': ':''}${n}" ${i===K.cur?'aria-current="step"':''}><i></i></button>`).join('')};
  const go=i=>{i=Math.max(0,Math.min(SCENES.length-1,i));K.cur=i;renderStage();renderPanel();renderDots();try{localStorage.setItem(key+'-scene',i)}catch(e){}};
  const turn=()=>{SFX.swish();cfg.ambient?.[K.cur]?.()};
  const view=g=>{$('#guide').hidden=!g;$('#book').hidden=g;$('#toggle').textContent=g?'Back to the story':'Notes for parents';if(g)scrollTo(0,0)};
  window.redraw=()=>{renderStage();renderPanel()};window.repanel=renderPanel;window.stage=stage;
  panel.addEventListener('click',e=>{
    const n=e.target.closest('[data-nav]');
    if(n){if(+n.dataset.nav>0&&K.cur===SCENES.length-1)return view(true);go(K.cur+ +n.dataset.nav);turn();$('.stagebox').scrollIntoView({block:'nearest',behavior:calm?'auto':'smooth'});return}
    const b=e.target.closest('[data-act]');if(b&&!b.disabled&&b.type!=='checkbox')SCENES[K.cur].act(b.dataset.act,b,e)});
  panel.addEventListener('change',e=>{const b=e.target.closest('[data-act]');if(b)SCENES[K.cur].act(b.dataset.act,b,e)});
  dots.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(b){go(+b.dataset.go);turn()}});
  $('#toggle').addEventListener('click',()=>view(!$('#book').hidden));
  document.addEventListener('keydown',e=>{if($('#book').hidden||/INPUT|TEXTAREA/.test(e.target.tagName))return;if(e.key==='ArrowRight'){go(K.cur+1);turn()}if(e.key==='ArrowLeft'){go(K.cur-1);turn()}});
  const snd=$('#snd'),paint=()=>{snd.textContent='Sound: '+(soundOn?'on':'off');snd.setAttribute('aria-pressed',soundOn)};
  snd.addEventListener('click',()=>{soundOn=!soundOn;try{localStorage.setItem(key+'-sound',soundOn?'on':'off')}catch(e){}paint();if(soundOn)SFX.ding();else if(AC)AC.suspend()});paint();
  let i=0;try{i=+localStorage.getItem(key+'-scene')||0}catch(e){}
  go(i);if(location.hash==='#guide')view(true);
}};
