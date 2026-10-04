// Mode « La musique » : clavier de C4 à G5 (piano, orgue, xylophone), accords, morceaux, forme de l'onde des notes qui sonnent
window.Music=(function(){
  var $=Utils.$,NAMES=['Do','Do♯','Ré','Ré♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'],LET=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'],BLACK=[1,3,6,8,10];
  var MAJ=[0,2,5,7,9],MIN=[9,4,2];                                          // C D F G A / Am Em Dm
  var LO=60,HI=79,KEYS=[],inst='piano',built=false,ROOT={C:0,D:2,E:4,F:5,G:7,A:9,B:11};
  for(var m=LO;m<=HI;m++){var pc=m%12;KEYS.push({m:m,pc:pc,black:BLACK.indexOf(pc)>=0,name:NAMES[pc],f:440*Math.pow(2,(m-69)/12)})}
  function hz(f){return Math.round(f)+' Hz'}
  function keyOf(m){return KEYS[m-LO]}
  function el(m){return document.querySelector('#kb [data-m="'+m+'"]')}
  function light(e,life){if(!e)return;e.style.setProperty('--lit-d',Math.min(1.9,Math.max(.4,life||1.9))+'s');e.classList.remove('lit');void e.offsetWidth;e.classList.add('lit')}
  function bind(b,fn){                                                       // réaction immédiate au toucher ; clavier physique géré par click
    b.addEventListener('pointerdown',function(e){if(e.button>0)return;e.preventDefault();fn()});
    b.addEventListener('click',function(e){if(e.detail===0)fn()});
  }

  /* ---------- emplacements du graphique : 6 lignes, un accord = bloc de 3 ---------- */
  var SLOTS=6,LC=['#FFB26B','#8CC4FF','#B79CFF','#6FE3A0','#FF8FB1','#F2E27A'],EMIT={piano:2,organ:2,xylo:1.6};   // durée d'émission du son (s)
  var rows=[null,null,null,null,null,null],lastChord=null,hintUntil=0,cap='';
  function clock(){return performance.now()/1000}
  function purge(n){for(var i=0;i<SLOTS;i++)if(rows[i]&&rows[i].exp<=n)rows[i]=null}
  function admit(id,ms,chord,life){
    var n=clock();purge(n);var exp=n+(life||EMIT[inst]),same=false;
    rows.forEach(function(r){if(r&&r.id===id){r.exp=exp;same=true}});                // même son déjà affiché : on prolonge simplement
    if(same){if(chord)lastChord=chord;return}
    var free=[];rows.forEach(function(r,i){if(!r)free.push(i)});
    if(free.length<ms.length){hintUntil=n+2;return}                                  // pas assez de places : rien n'est affiché
    ms.forEach(function(m,j){rows[free[j]]={m:m,exp:exp,id:id}});if(chord)lastChord=chord;
  }
  function active(){purge(clock());return rows.filter(Boolean).length}

  /* ---------- forme de l'onde ---------- */
  var SH={piano:{a:[1,.55,.3,.16,.08],m:[1,2,3,4,5]},organ:{a:[1,.7,.45,.3],m:[1,2,3,4]},xylo:{a:[1,.38,.14],m:[1,3,6]}};   // même recette que les instruments
  Object.keys(SH).forEach(function(k){var s=SH[k],p=0;for(var i=0;i<720;i++){var x=i/720*6.2832,y=0;s.a.forEach(function(a,j){y+=a*Math.sin(s.m[j]*x)});p=Math.max(p,Math.abs(y))}s.peak=p});
  function wave(x){var s=SH[inst],y=0;for(var j=0;j<s.a.length;j++)y+=s.a[j]*Math.sin(s.m[j]*x);return y/s.peak}
  var cv=$('mu-wave'),c=cv.getContext('2d'),W=300,H=170,run=false,last=0,t=0,anim=!matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){var d=window.devicePixelRatio||1,w=cv.clientWidth;if(!w)return;W=w;cv.width=w*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}
  function caption(n){
    var s,cls='',has=function(m){return rows.some(function(r){return r&&r.m===m})};
    if(hintUntil>n)s='Le graphique est complet : attends qu\'une courbe disparaisse.';
    else if(has(60)&&has(72))s='Le Do aigu a 2 fois plus de vagues que le Do grave : c\'est la même note, une octave plus haut.';
    else if(lastChord&&rows.some(function(r){return r&&r.id===lastChord.id})){s=lastChord.text;cls=lastChord.cls}
    else s='Plus la note est aiguë, plus il y a de vagues. La forme de la vague dépend de l\'instrument.';
    if(s!==cap){cap=s;$('mu-wcap').textContent=s;$('mu-wcap').className='small mu-cap '+cls}
  }
  function drawWave(n){
    c.fillStyle='#050C11';c.fillRect(0,0,W,H);
    purge(n);var any=rows.some(Boolean);
    if(!any){c.fillStyle='#8FA3B3';c.font='700 12px Figtree,sans-serif';c.textAlign='center';c.fillText('Joue une note ou un accord pour voir son onde',W/2,H/2+4);return}
    var lh=(H-6)/SLOTS,xs=62,xe=W-8;
    rows.forEach(function(r,i){if(!r)return;var k=keyOf(r.m),nv=k.f/131,y0=3+lh*(i+.5),A=lh*.36,ph=6.2832*(.4+.15*nv)*t;   // nv : nombre de vagues, proportionnel à la fréquence (Do grave = 2, Do aigu = 4)
      c.globalAlpha=Math.min(1,(r.exp-n)/.5);                                                                             // fondu pendant la fin du son
      c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=1;c.setLineDash([2,5]);c.beginPath();c.moveTo(xs,y0);c.lineTo(xe,y0);c.stroke();c.setLineDash([]);
      c.strokeStyle=LC[i];c.lineWidth=2;c.beginPath();
      for(var x=xs;x<=xe;x+=2){var y=y0-A*wave(6.2832*nv*(x-xs)/(xe-xs)-ph);x===xs?c.moveTo(x,y):c.lineTo(x,y)}c.stroke();
      c.fillStyle=LC[i];c.textAlign='left';c.font='800 11px Figtree,sans-serif';c.fillText(k.name,8,y0-1);c.font='700 9.5px Figtree,sans-serif';c.fillText(hz(k.f),8,y0+9);
      c.globalAlpha=1});
  }
  function loop(ts){
    if(!run)return;var n=ts/1000,dt=Math.min(.05,(ts-last)/1000||0);last=ts;
    if(anim&&rows.some(Boolean))t+=dt;drawWave(n);caption(n);requestAnimationFrame(loop);
  }
  window.addEventListener('resize',function(){if(run)size()});

  /* ---------- notes et accords ---------- */
  function chordMs(r,t2){var third=t2==='maj'?4:3;return[0,third,7].map(function(x){return 60+(r+x)%12}).sort(function(a,b){return a-b})}
  function freqs(ms){return ms.map(function(m){return keyOf(m).f})}
  function visNote(m,life){light(el(m),life);admit('n'+m,[m],null,life)}
  function visChord(r,t2,life){
    var ms=chordMs(r,t2),id='c'+r+t2;ms.forEach(function(m){light(el(m),life)});light(document.querySelector('.ch[data-r="'+r+'"][data-t="'+t2+'"]'),life);
    admit(id,ms,{id:id,text:'Accord de '+NAMES[r]+(t2==='maj'?' majeur':' mineur')+' ('+LET[r]+(t2==='min'?'m':'')+') · '+(t2==='maj'?'joyeux':'triste'),cls:t2==='maj'?'is-joy':'is-sad'},life);
  }
  function note(m){Instruments.play(inst,[keyOf(m).f]);visNote(m)}
  function chord(r,t2){Instruments.play(inst,freqs(chordMs(r,t2)));visChord(r,t2)}

  /* ---------- morceaux : lecture programmée sur l'horloge audio (rythme exact) ---------- */
  var timers=[],playing=false,SPD={slow:.7,normal:1,fast:1.35},curSong=null;
  function pitch(s){var q=/^([A-G])([#b]?)(\d)$/.exec(s);if(!q)return null;return 12*(+q[3]+1)+ROOT[q[1]]+(q[2]==='#'?1:q[2]==='b'?-1:0)}
  function parse(src){
    var ev=[],b=0;
    src.split(/\s+/).forEach(function(tk){
      if(!tk||tk==='|')return;var p=tk.split(':'),len=parseFloat(p[1]||'1'),h=p[0];
      if(h.charAt(0)==='@'){var q=/^@([A-G])(m?)$/.exec(h);if(q)ev.push({b:b,len:len,chord:{r:ROOT[q[1]],t:q[2]?'min':'maj'}})}
      else if(h!=='R'){var m=pitch(h);if(m>=LO&&m<=HI)ev.push({b:b,len:len,m:m})}
      b+=len;
    });
    return{ev:ev,total:b};
  }
  function ui(){var g=$('mu-go');g.disabled=!curSong;g.textContent=playing?'■':'▶';g.setAttribute('aria-label',playing?'Arrêter le morceau':'Rejouer le morceau')}
  function stopSong(){timers.forEach(clearTimeout);timers=[];if(playing){playing=false;Instruments.stopAll()}ui()}
  function playSong(s){
    stopSong();if(!s||!Instruments.unlock())return;
    var P=parse(s.n),sec=60/s.bpm/SPD[$('mu-spd').value],lead=.08,base=Instruments.time()+lead;playing=true;ui();
    P.ev.forEach(function(e){
      var d=e.b*sec,dur=Math.max(.12,e.len*sec-.04),ms=e.chord?chordMs(e.chord.r,e.chord.t):[e.m];
      Instruments.play(inst,freqs(ms),base+d,dur);                                           // son : instant exact sur l'horloge audio
      timers.push(setTimeout(function(){e.chord?visChord(e.chord.r,e.chord.t,dur+.3):visNote(e.m,dur+.3)},(lead+d)*1000));   // image : au même moment
    });
    timers.push(setTimeout(function(){playing=false;ui()},(lead+P.total*sec)*1000+300));
  }

  function build(){
    var kb=$('kb'),w=0,html='',N=KEYS.filter(function(k){return !k.black}).length,U=100/N;
    KEYS.forEach(function(k,i){if(k.black)return;
      html+='<button class="wk" data-m="'+k.m+'" style="left:calc('+(w*U)+'% + 1.5px);width:calc('+U+'% - 3px);--w:'+w+';--h:'+(i*16)+'" aria-label="'+k.name+', '+hz(k.f)+'">'+k.name+'</button>';w++});
    var wi=0;KEYS.forEach(function(k,i){if(!k.black){wi++;return}
      html+='<button class="bk" data-m="'+k.m+'" style="left:'+(wi*U-U*.34)+'%;width:'+(U*.68)+'%;--h:'+(i*16)+'" aria-label="'+k.name+', '+hz(k.f)+'">'+k.name+'</button>'});
    kb.innerHTML=html;
    kb.querySelectorAll('button').forEach(function(b){bind(b,function(){note(+b.dataset.m)})});
    function row(id,roots,t2){$(id).innerHTML=roots.map(function(r){var third=t2==='maj'?4:3,n=[0,third,7].map(function(x){return NAMES[(r+x)%12]}).join('–');
      return'<button class="ch ch--'+t2+'" data-r="'+r+'" data-t="'+t2+'" aria-label="Accord de '+NAMES[r]+(t2==='maj'?' majeur':' mineur')+' : '+n.replace(/–/g,', ')+'"><b>'+LET[r]+(t2==='min'?'m':'')+'</b><small>'+n+'</small></button>'}).join('');
      $(id).querySelectorAll('button').forEach(function(b){bind(b,function(){chord(+b.dataset.r,t2)})})}
    row('ch-maj',MAJ,'maj');row('ch-min',MIN,'min');
    var sel=$('mu-song'),groups={};                                                        // menu des morceaux, par famille
    (window.Songs||[]).forEach(function(s,i){var g=groups[s.g];if(!g){g=groups[s.g]=document.createElement('optgroup');g.label=s.g;sel.appendChild(g)}
      var o=document.createElement('option');o.value=i;o.textContent=s.t;g.appendChild(o)});
    built=true;
  }
  $('mu-song').addEventListener('change',function(){curSong=this.value===''?null:Songs[+this.value];if(curSong)playSong(curSong);else stopSong();ui()});
  $('mu-spd').addEventListener('change',function(){if(playing&&curSong)playSong(curSong)});
  $('mu-go').addEventListener('click',function(){if(playing)stopSong();else if(curSong)playSong(curSong)});
  $('mu-inst').addEventListener('click',function(e){                         // changer d'instrument ne produit aucun son
    var b=e.target.closest('button');if(!b)return;stopSong();inst=b.dataset.i;
    this.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('kb').className='kb kb--'+inst;
    $('mu-wtitle').textContent='La forme de l\'onde ('+b.textContent.toLowerCase()+')';
  });
  return{
    start:function(){if(!built)build();rows=[null,null,null,null,null,null];lastChord=null;cap='';size();ui();run=true;last=performance.now();requestAnimationFrame(loop)},
    stop:function(){run=false;timers.forEach(clearTimeout);timers=[];playing=false;Instruments.stopAll();ui()},
    active:active,parse:parse
  };
})();
