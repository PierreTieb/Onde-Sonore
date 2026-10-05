// Morceaux : notes en lettres + octave (C4 = Do du milieu), durée en temps après « : ». R = silence, @Am = accord.
// Seules les mélodies du domaine public sont ajoutées ici. Le clavier va de C4 à G5.
// Drunken Sailor, Le Printemps et la Symphonie n°40 ont été extraites de fichiers MIDI (notes et durées exactes), puis transposées pour tenir sur le clavier.
window.Songs=[
  {g:'Chanson',t:'Au clair de la lune',bpm:96,
   n:'C5:1 C5:1 C5:1 D5:1 | E5:2 D5:2 | C5:1 E5:1 D5:1 D5:1 | C5:4 | C5:1 C5:1 C5:1 D5:1 | E5:2 D5:2 | C5:1 E5:1 D5:1 D5:1 | C5:4 | D5:1 D5:1 D5:1 D5:1 | A4:2 A4:2 | D5:1 C5:1 B4:1 A4:1 | G4:4 | C5:1 C5:1 C5:1 D5:1 | E5:2 D5:2 | C5:1 E5:1 D5:1 D5:1 | C5:4'},
  {g:'Chanson',t:'Joyeux anniversaire',bpm:100,
   n:'C4:.75 C4:.25 | D4:1 C4:1 F4:1 | E4:2 C4:.75 C4:.25 | D4:1 C4:1 G4:1 | F4:2 C4:.75 C4:.25 | C5:1 A4:1 F4:1 | E4:1 D4:1 Bb4:.75 Bb4:.25 | A4:1 F4:1 G4:1 | F4:3'},
  {g:'Chanson',t:'Drunken Sailor',bpm:110,
   n:'D5:0.5 D5:0.25 D5:0.25 D5:0.5 D5:0.25 D5:0.25 D5:1 A#4:0.5 D5:0.5 C5:0.5 C5:0.25 C5:0.25 C5:0.5 C5:0.25 C5:0.25 C5:1 A4:0.5 C5:0.5 D5:0.5 D5:0.25 D5:0.25 D5:0.5 D5:0.25 D5:0.25 E5:0.5 E5:0.5 F5:0.5 G5:0.5 F5:0.5 D5:0.5 C5:0.1667 D5:0.1667 C5:2.6667 D5:1 D5:1 D5:0.5 G4:0.5 A#4:0.5 D5:0.5 C5:1 C5:1 C5:0.5 F4:0.5 A4:0.5 C5:0.5 D5:1 D5:1 D5:0.5 E5:0.5 F5:0.5 G5:0.5 F5:0.5 D5:0.5 C5:0.1667 D5:0.1667 C5:0.1667 A4:1.5 G4:1 D5:1 D5:1 D5:1 A#4:0.5 D5:0.5 C5:1 C5:1 C5:1 A4:0.5 C5:0.5 D5:1 D5:1 D5:0.5 E5:0.5 F5:0.5 G5:0.5 F5:0.5 D5:0.5 C5:0.1667 D5:0.1667 C5:2.1667'},
  {g:'Classique',t:'Ode à la joie (Beethoven)',bpm:108,
   n:'B4:1 B4:1 C5:1 D5:1 | D5:1 C5:1 B4:1 A4:1 | G4:1 G4:1 A4:1 B4:1 | B4:1.5 A4:.5 A4:2 | B4:1 B4:1 C5:1 D5:1 | D5:1 C5:1 B4:1 A4:1 | G4:1 G4:1 A4:1 B4:1 | A4:1.5 G4:.5 G4:2 | A4:1 A4:1 B4:1 G4:1 | A4:1 B4:.5 C5:.5 B4:1 G4:1 | A4:1 B4:.5 C5:.5 B4:1 A4:1 | G4:1 A4:1 D4:2 | B4:1 B4:1 C5:1 D5:1 | D5:1 C5:1 B4:1 A4:1 | G4:1 G4:1 A4:1 B4:1 | A4:1.5 G4:.5 G4:2'},
  {g:'Classique',t:'Le Printemps (Vivaldi)',bpm:108,
   n:'G4:0.5 B4:0.5 B4:0.5 B4:0.5 A4:0.25 G4:0.25 D5:1.5 D5:0.25 C5:0.25 B4:0.5 B4:0.5 B4:0.5 A4:0.25 G4:0.25 D5:1.5 D5:0.25 C5:0.25 B4:0.5 C5:0.25 D5:0.25 C5:0.5 B4:0.5 A4:0.5 F#4:0.5 D4:0.5 G4:0.5 B4:0.5 B4:0.5 B4:0.5 A4:0.25 G4:0.25 D5:1.5 D5:0.25 C5:0.25 B4:0.5 B4:0.5 B4:0.5 A4:0.25 G4:0.25 D5:1.5 D5:0.25 C5:0.25 B4:0.5 C5:0.25 D5:0.25 C5:0.5 B4:0.5 A4:1 R:0.5 G4:0.5 D5:0.5 C5:0.25 B4:0.25 C5:0.5 D5:0.5 E5:0.5 D5:1 G4:0.5 D5:0.5 C5:0.25 B4:0.25 C5:0.5 D5:0.5 E5:0.5 D5:1 G4:0.5 E5:0.5 D5:1 C5:0.5 B4:0.5 A4:0.25 G4:0.25 A4:1 G4:1 R:0.5'},
  {g:'Classique',t:'Symphonie n°40 (Mozart)',bpm:160,
   n:'C5:0.5 B4:0.5 B4:1 C5:0.5 B4:0.5 B4:1 C5:0.5 B4:0.5 B4:1 G5:2 G5:0.5 F#5:0.5 E5:1 E5:0.5 D5:0.5 C5:1 C5:0.5 B4:0.5 A4:1 A4:2 B4:0.5 A4:0.5 A4:1 B4:0.5 A4:0.5 A4:1 B4:0.5 A4:0.5 A4:1 F#5:2 F#5:0.5 E5:0.5 D#5:1 D#5:0.5 C5:0.5 B4:1 B4:0.5 A4:0.5 G4:1 G4:2'}
];

// ---- En réserve (non affichés dans le menu). Pour en remettre un, copier sa ligne dans la liste ci-dessus. ----
//   {g:'Chanson',t:'Camptown Races (Foster)',bpm:104,
//    n:'A4:0.5 A4:0.5 A4:0.5 F#4:0.5 A4:0.5 B4:0.5 A4:0.5 F#4:0.5 R:0.5 F#4:0.5 E4:1.5 F#4:0.5 E4:1 A4:0.5 A4:0.5 A4:0.5 F#4:0.5 A4:0.5 B4:0.5 A4:0.5 F#4:0.5 R:0.5 E4:1 F#4:0.5 E4:0.5 D4:1 R:0.5 A4:0.5 A4:0.5 A4:0.5 F#4:0.5 A4:0.5 B4:0.5 A4:0.5 F#4:0.5 R:0.5 F#4:0.5 E4:1.5 F#4:0.5 E4:1 A4:0.5 A4:0.5 A4:0.5 F#4:0.5 A4:0.25 A4:0.25 B4:0.25 B4:0.25 A4:0.25 A4:0.25 F#4:0.5 R:0.5 E4:1 F#4:0.5 E4:0.5 D4:1.5 R:0.5 D4:0.75 D4:0.25 F#4:0.5 A4:0.5 D5:1.5 R:0.5 B4:0.75 B4:0.25 D5:0.5 B4:0.5 A4:1.5 F#4:0.25 G4:0.25 A4:0.5 A4:0.5 F#4:0.25 F#4:0.25 A4:0.25 A4:0.25 B4:0.5 A4:0.5 F#4:1 E4:0.5 F#4:0.25 G4:0.25 F#4:0.25 E4:0.5 E4:0.25 D4:1.5'}
