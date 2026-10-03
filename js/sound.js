// Détonation synthétisée : atténuation avec la distance, filtre selon le milieu, ralentie si le mode Ralenti est actif
window.Sound=(function(){
  var AC=null;
  function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state!=='running')AC.resume()}catch(e){}}
  function boom(m,d,slow){
    if(!AC)return;
    try{
      var lf=Math.max(0,Math.min(1,Math.log(d/10)/Math.log(300)));
      var gain=.9*Math.pow(10,-.45*Math.log10(d/10));          // 10 m : fort, 3 km : environ -22 dB
      var cut={air:4500,water:550,rock:2200}[m]*(1-.65*lf);    // le lointain devient plus sourd
      var rate=slow>1?Math.max(.25,1/slow):1;                  // ralenti : son étiré et plus grave
      var len=Math.floor(AC.sampleRate*1.0),buf=AC.createBuffer(1,len,AC.sampleRate),a=buf.getChannelData(0);
      for(var i=0;i<len;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);
      var s=AC.createBufferSource();s.buffer=buf;s.playbackRate.value=rate;
      var f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=cut;
      var g=AC.createGain();g.gain.value=gain;
      s.connect(f);f.connect(g);g.connect(AC.destination);s.start();
    }catch(e){}
  }
  return{unlock:unlock,boom:boom};
})();
