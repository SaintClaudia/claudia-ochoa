/* Fictional arcade balance, not measured golf abilities of the real players. */
(function(root) {
  'use strict';
  const profiles={
    purdy:{style:'Precision',description:'Less wind drift on airborne shots.',ranges:{driver:285,iron:180,wedge:95,putter:75},windFactor:.65,rough:.72,bunker:.48,sandWedge:.90},
    mccaffrey:{style:'Recovery',description:'Keeps more distance from rough and sand.',ranges:{driver:300,iron:185,wedge:98,putter:75},windFactor:.85,rough:.84,bunker:.60,sandWedge:.96},
    kittle:{style:'Power',description:'Longest drives, with more wind drift.',ranges:{driver:320,iron:195,wedge:100,putter:75},windFactor:1.05,rough:.76,bunker:.52,sandWedge:.92}
  };
  function shotRange({golfer,club,power,lie}) {
    const profile=profiles[golfer];
    // Putting is identical for every golfer, including penalties off the green.
    const factor=lie==='Bunker'?(club==='putter'?.48:club==='wedge'?profile.sandWedge:profile.bunker):lie==='Rough'?(club==='putter'?.72:profile.rough):1;
    return profile.ranges[club]*Math.max(0,Math.min(100,power))/100*factor;
  }
  function target(options) {
    const {golfer,club,power,angle,origin,wind}=options;
    const range=shotRange(options),windScale=club==='putter'?0:Math.max(0,Math.min(100,power))/100*profiles[golfer].windFactor;
    return {x:origin.x+Math.cos(angle)*range+wind.x*windScale,y:origin.y+Math.sin(angle)*range+wind.y*windScale};
  }
  const api={profiles,shotRange,target};
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.BirdiesPlayerSkills=api;
})(typeof window==='object'?window:globalThis);
