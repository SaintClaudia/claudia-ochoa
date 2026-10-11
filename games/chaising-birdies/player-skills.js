/* Fictional arcade balance, not measured golf abilities of the real players. */
(function(root) {
  'use strict';
  const profiles={
    purdy:{style:'Precision',description:'Less wind drift on airborne shots.',ranges:{driver:285,iron:165,wedge:80,putter:60},windFactor:.65,rough:.72,bunker:.48,sandWedge:.90},
    mccaffrey:{style:'Recovery',description:'Keeps more distance from rough and sand.',ranges:{driver:300,iron:172,wedge:82,putter:60},windFactor:.85,rough:.84,bunker:.60,sandWedge:.96},
    kittle:{style:'Power',description:'Longest drives, with more wind drift.',ranges:{driver:320,iron:180,wedge:85,putter:60},windFactor:1.05,rough:.76,bunker:.52,sandWedge:.92}
  };
  const clubs={
    driver:{label:'Driver',loft:85,wind:.85},
    iron:{label:'7 iron',loft:110,wind:1},
    wedge:{label:'Sand wedge',loft:135,wind:.65},
    putter:{label:'Putter',loft:0,wind:0}
  };
  function lieFactor({golfer,club,lie}) {
    const profile=profiles[golfer];
    // The putter is shared by all golfers; grass and sand absorb its roll.
    if(club==='putter')return lie==='Bunker'?.18:lie==='Rough'?.40:lie==='Fairway'||lie==='Tee box'?.80:1;
    if(lie==='Bunker')return club==='wedge'?profile.sandWedge:profile.bunker*(club==='driver'?.40:.65);
    if(lie==='Rough')return profile.rough*(club==='driver'?.80:1);
    return club==='driver'&&lie==='Green'?.75:1;
  }
  function shotRange(options) {
    return profiles[options.golfer].ranges[options.club]*Math.max(0,Math.min(100,options.power))/100*lieFactor(options);
  }
  function shotLoft({club,power}) {
    return clubs[club].loft*Math.sqrt(Math.max(0,Math.min(100,power))/100);
  }
  function windScale({golfer,club,power}) {
    return Math.max(0,Math.min(100,power))/100*profiles[golfer].windFactor*clubs[club].wind;
  }
  function recommendShot(options) {
    const {origin,pin,lie}=options,d=Math.hypot(pin.x-origin.x,pin.y-origin.y);
    const full=club=>shotRange({...options,club,power:100});
    let club;
    if(lie==='Bunker')club='wedge';
    else if(lie==='Green'&&d<=full('putter'))club='putter';
    else if(d<=full('wedge'))club='wedge';
    else if(d<=full('iron'))club='iron';
    else club='driver';
    // Account for head/tail wind in the suggested power; aim remains adjustable.
    const wind=options.wind||{x:0,y:0};
    const along=d?((pin.x-origin.x)*wind.x+(pin.y-origin.y)*wind.y)/d:0;
    const range=Math.max(1,full(club)+along*windScale({...options,club,power:100}));
    return {club,power:Math.max(5,Math.min(100,Math.round(d/range*100)))};
  }
  function target(options) {
    const {angle,origin,wind}=options;
    const range=shotRange(options),drift=windScale(options);
    return {x:origin.x+Math.cos(angle)*range+wind.x*drift,y:origin.y+Math.sin(angle)*range+wind.y*drift};
  }
  const api={profiles,clubs,shotRange,shotLoft,recommendShot,target};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.BirdiesPlayerSkills=api;
})(typeof window==='object'?window:globalThis);
