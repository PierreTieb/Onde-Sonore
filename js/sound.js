// Détonation synthétisée : le même son dans tous les milieux, atténué seulement par la distance (même atténuation partout).
// Mode Ralenti : son étiré et plus grave, volume compensé pour rester au même niveau.
window.Sound=(function(){
  var AC=null;
  function unlock(){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state!=='running')AC.resume()}catch(e){}}
  function boom(m,d,slow){
    if(!AC)return;
    try{
      var lf=Math.max(0,Math.min(1,Math.log(d/10)/Math.log(300)));
      var rate=slow>1?Math.max(.5,1/slow):1;                     // ralenti (m n'intervient pas : même son dans l'air, l'eau et la roche)
      var gain=.9*Math.pow(10,-.45*Math.log10(d/10))/Math.sqrt(rate);   // 10 m : fort, 3 km : environ -22 dB ; un son ralenti (plus grave) est compensé
      var cut=4000*(1-.5*lf);                                    // le lointain devient plus sourd
      var len=Math.floor(AC.sampleRate*1.0),buf=AC.createBuffer(1,len,AC.sampleRate),a=buf.getChannelData(0);
      for(var i=0;i<len;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/len,3.2);
      var s=AC.createBufferSource();s.buffer=buf;s.playbackRate.value=rate;
      var f=AC.createBiquadFilter();f.type='lowpass';f.frequency.value=cut;
      var g=AC.createGain();g.gain.value=Math.min(1.4,gain);
      s.connect(f);f.connect(g);g.connect(AC.destination);
      s.start();
    }catch(e){}
  }
  return{unlock:unlock,boom:boom};
})();
