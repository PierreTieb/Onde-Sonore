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
  function note(m){Instruments.play(inst,[keyOf(m).f]);light(document.querySelector('#kb [data-m="'+m+'"]'));show([m],'Note : '+keyOf(m).name)}
  function chord(r,t,btn){
    var third=t==='maj'?4:3,ms=[0,third,7].map(function(x){return 60+(r+x)%12});
    Instruments.play(inst,ms.map(function(m){return keyOf(m).f}));
    ms.forEach(function(m){light(document.querySelector('#kb [data-m="'+m+'"]'))});light(btn);
    show(ms,'Accord de '+NAMES[r]+(t==='maj'?' majeur · joyeux':' mineur · triste'),t==='maj'?'is-joy':'is-sad');
  }
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
    this.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});$('kb').className='kb kb--'+inst;
  });
  return{start:function(){if(!built)build();show([],'Touche une note du clavier ou un accord pour l\'entendre.')},stop:function(){Instruments.stopAll()}};
})();
