// Mode « La musique » : clavier d'une octave (piano, orgue, xylophone) et accords. Une touche sonne dès qu'on la touche.
window.Music=(function(){
  var $=Utils.$,NAMES=['Do','Do♯','Ré','Ré♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'],LET=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'],BLACK=[1,3,6,8,10];
  var MAJ=[0,2,5,7,9],MIN=[9,4,2];                                          // C D F G A / Am Em Dm
  var KEYS=[],inst='piano',built=false;
  for(var m=60;m<=72;m++){var pc=m%12;KEYS.push({m:m,pc:pc,black:BLACK.indexOf(pc)>=0,name:m===72?'Do':NAMES[pc],f:440*Math.pow(2,(m-69)/12)})}
  function hz(f){return Math.round(f)+' Hz'}
  function keyOf(m){return KEYS[m-60]}
  function light(e){if(!e)return;e.classList.remove('lit');void e.offsetWidth;e.classList.add('lit')}
  function bind(b,fn){                                                       // réaction immédiate au toucher ; clavier physique géré par click
    b.addEventListener('pointerdown',function(e){if(e.button>0)return;e.preventDefault();fn()});
    b.addEventListener('click',function(e){if(e.detail===0)fn()});
  }
  function show(ms,title,cls){
    $('mu-sel').innerHTML=ms.map(function(m){var k=keyOf(m);return'<span class="mu-chip"><b>'+k.name+'</b> '+hz(k.f)+'</span>'}).join('');
    $('mu-chord').textContent=title;$('mu-chord').className='mu-chord '+(cls||'');
  }
  function note(m){Instruments.play(inst,[keyOf(m).f]);light(document.querySelector('#kb [data-m="'+m+'"]'));show([m],'Note : '+keyOf(m).name);track([m],false)}
  function chord(r,t,btn){
    var third=t==='maj'?4:3,ms=[0,third,7].map(function(x){return 60+(r+x)%12});
    Instruments.play(inst,ms.map(function(m){return keyOf(m).f}));
    ms.forEach(function(m){light(document.querySelector('#kb [data-m="'+m+'"]'))});light(btn);
    track(ms,true);
    show(ms,'Accord de '+NAMES[r]+(t==='maj'?' majeur · joyeux':' mineur · triste'),t==='maj'?'is-joy':'is-sad');
  }
  /* ---- graphiques : forme de l'onde (haut) et règle des fréquences (bas) ---- */
  var lanes=[],lastChord=false,LC=['#FFB26B','#8CC4FF','#B79CFF','#6FE3A0'];
  var SH={piano:{a:[1,.55,.3,.16,.08],m:[1,2,3,4,5]},organ:{a:[1,.7,.45,.3],m:[1,2,3,4]},xylo:{a:[1,.38,.14],m:[1,3,6]}};   // même recette que les instruments
  Object.keys(SH).forEach(function(k){var s=SH[k],p=0;for(var i=0;i<720;i++){var x=i/720*6.2832,y=0;s.a.forEach(function(a,j){y+=a*Math.sin(s.m[j]*x)});p=Math.max(p,Math.abs(y))}s.peak=p});
  function wave(x){var s=SH[inst],y=0;for(var j=0;j<s.a.length;j++)y+=s.a[j]*Math.sin(s.m[j]*x);return y/s.peak}
  var cv=$('mu-wave'),c=cv.getContext('2d'),W=300,H=190,run=false,last=0,t=0,anim=!matchMedia('(prefers-reduced-motion:reduce)').matches;
  function size(){var d=window.devicePixelRatio||1,w=cv.clientWidth;if(!w)return;W=w;cv.width=w*d;cv.height=H*d;c.setTransform(d,0,0,d,0,0)}
  function drawWave(){
    c.fillStyle='#050C11';c.fillRect(0,0,W,H);
    if(!lanes.length){c.fillStyle='#8FA3B3';c.font='700 12px Figtree,sans-serif';c.textAlign='center';c.fillText('Joue une note ou un accord pour voir son onde',W/2,H/2);return}
    var lh=Math.min(46,(H-6)/lanes.length),top=(H-lh*lanes.length)/2,xs=66,xe=W-8;
    lanes.forEach(function(m,i){var k=keyOf(m),n=k.f/131,y0=top+lh*(i+.5),A=lh*.38,ph=6.2832*(.4+.15*n)*t;   // n : nombre de vagues, proportionnel à la fréquence (Do grave = 2, Do aigu = 4)
      c.strokeStyle='rgba(255,255,255,.12)';c.lineWidth=1;c.setLineDash([2,5]);c.beginPath();c.moveTo(xs,y0);c.lineTo(xe,y0);c.stroke();c.setLineDash([]);
      c.strokeStyle=LC[i];c.lineWidth=2.2;c.beginPath();
      for(var x=xs;x<=xe;x+=2){var y=y0-A*wave(6.2832*n*(x-xs)/(xe-xs)-ph);x===xs?c.moveTo(x,y):c.lineTo(x,y)}c.stroke();
      c.fillStyle=LC[i];c.textAlign='left';c.font='800 11.5px Figtree,sans-serif';c.fillText(k.name,8,y0);c.font='700 10px Figtree,sans-serif';c.fillText(hz(k.f),8,y0+12)});
  }
  function loop(now){if(!run)return;var dt=Math.min(.05,(now-last)/1000||0);last=now;if(anim&&lanes.length)t+=dt;drawWave();requestAnimationFrame(loop)}
  function caption(){var oct=lanes.indexOf(60)>=0&&lanes.indexOf(72)>=0;
    $('mu-wcap').textContent=oct?'Le Do aigu a 2 fois plus de vagues que le Do grave : c\'est la même note, une octave plus haut.':'Plus la note est aiguë, plus il y a de vagues. La forme de la vague dépend de l\'instrument.'}
  function ruler(){
    var X=function(f){return 14+292*Math.log(f/250)/Math.log(540/250)},s='',both=lanes.indexOf(60)>=0&&lanes.indexOf(72)>=0,x1=X(keyOf(60).f),x2=X(keyOf(72).f),T='font-family="Figtree,sans-serif" font-weight="700"';
    s+='<path d="M'+x1+' 38 C'+x1+' 2,'+x2+' 2,'+x2+' 38" fill="none" stroke="#FFB26B" stroke-width="'+(both?3:1.5)+'"'+(both?'':' stroke-dasharray="4 4"')+' opacity="'+(both?1:.5)+'"/>'+
       '<text x="'+((x1+x2)/2)+'" y="22" text-anchor="middle" font-size="11" '+T+' fill="#FFB26B" opacity="'+(both?1:.7)+'">octave : fréquence × 2</text>'+
       '<line x1="10" y1="52" x2="310" y2="52" stroke="#55606A" stroke-width="2"/>';
    KEYS.forEach(function(k){var x=X(k.f),i=lanes.indexOf(k.m),col=i>=0?LC[i]:'#C9D3DC';
      s+=k.black?'<line x1="'+x+'" y1="49" x2="'+x+'" y2="55" stroke="#7A8590" stroke-width="1.5"/>':
        '<line x1="'+x+'" y1="46" x2="'+x+'" y2="58" stroke="'+col+'" stroke-width="2"/><text x="'+x+'" y="40" text-anchor="middle" font-size="10.5" '+T+' fill="'+col+'">'+k.name+'</text><text x="'+x+'" y="74" text-anchor="middle" font-size="9.5" '+T+' fill="#8FA3B3">'+Math.round(k.f)+'</text>'});
    lanes.forEach(function(m,i){var k=keyOf(m),x=X(k.f);s+='<circle cx="'+x+'" cy="52" r="6.5" fill="'+LC[i]+'" stroke="#0A0F13" stroke-width="2"/>'+(k.black?'<text x="'+x+'" y="31" text-anchor="middle" font-size="10" '+T+' fill="'+LC[i]+'">'+k.name+'</text>':'')});
    s+='<text x="10" y="94" font-size="10" '+T+' fill="#8FA3B3">← plus grave</text><text x="310" y="94" text-anchor="end" font-size="10" '+T+' fill="#8FA3B3">plus aigu →</text>';
    $('mu-rule').innerHTML='<svg viewBox="0 0 320 100" width="100%" aria-hidden="true" style="display:block">'+s+'</svg>';
  }
  function track(ms,isChord){
    if(isChord||lastChord)lanes=isChord?ms.slice().sort(function(a,b){return a-b}):[ms[0]];
    else{lanes=lanes.filter(function(x){return x!==ms[0]});lanes.push(ms[0]);if(lanes.length>4)lanes.shift()}
    lastChord=isChord;ruler();caption();
  }
  window.addEventListener('resize',function(){if(run)size()});
  function build(){
    var kb=$('kb'),w=0,html='';
    KEYS.forEach(function(k,i){if(k.black)return;
      html+='<button class="wk" data-m="'+k.m+'" style="left:calc('+(w*12.5)+'% + 1.5px);--w:'+w+';--h:'+(i*25)+'" aria-label="'+k.name+', '+hz(k.f)+'">'+k.name+'</button>';w++});
    var wi=0;KEYS.forEach(function(k,i){if(!k.black){wi++;return}
      html+='<button class="bk" data-m="'+k.m+'" style="left:'+(wi*12.5-3.75)+'%;--h:'+(i*25)+'" aria-label="'+k.name+', '+hz(k.f)+'">'+k.name+'</button>'});
    kb.innerHTML=html;
    kb.querySelectorAll('button').forEach(function(b){bind(b,function(){note(+b.dataset.m)})});
    function row(id,roots,t){$(id).innerHTML=roots.map(function(r){var third=t==='maj'?4:3,n=[0,third,7].map(function(x){return NAMES[(r+x)%12]}).join(' — ');
      return'<button class="ch ch--'+t+'" data-r="'+r+'" aria-label="Accord de '+NAMES[r]+(t==='maj'?' majeur':' mineur')+' : '+n+'"><b>'+LET[r]+(t==='min'?'m':'')+'</b><small>'+n+'</small></button>'}).join('');
      $(id).querySelectorAll('button').forEach(function(b){bind(b,function(){chord(+b.dataset.r,t,b)})})}
    row('ch-maj',MAJ,'maj');row('ch-min',MIN,'min');built=true;
  }
  $('mu-inst').addEventListener('click',function(e){                         // changer d'instrument ne produit aucun son
    var b=e.target.closest('button');if(!b)return;inst=b.dataset.i;
    this.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('kb').className='kb kb--'+inst;$('mu-wtitle').textContent='La forme de l\'onde ('+this.querySelector('[aria-pressed=true]').textContent.toLowerCase()+')';
  });
  return{start:function(){if(!built)build();show([],'Touche une note du clavier ou un accord pour l\'entendre.');size();run=true;last=performance.now();ruler();caption();requestAnimationFrame(loop)},stop:function(){run=false;Instruments.stopAll()}};
})();
