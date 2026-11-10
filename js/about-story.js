(() => {
      const root = document.getElementById('claudia-about-design');
      const canvas = root.querySelector('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)');
      const state = { playing:!reduced.matches, duration:16 };
      let last = null, elapsed = 0, visible = true;
      function paint() {
        const size = canvas.clientWidth || 240;
        const ratio = Math.min(devicePixelRatio || 1,2);
        if(canvas.width !== Math.round(size*ratio)) {canvas.width=Math.round(size*ratio); canvas.height=canvas.width;}
        ctx.setTransform(canvas.width/320,0,0,canvas.height/320,0,0);
        ctx.clearRect(0,0,320,320);
        const t = elapsed/1000 * Math.PI*2/state.duration;
        const n=192, points=[];
        for(let i=0;i<n;i++) {
          const a=i/n*Math.PI*2;
          const wave = Math.sin(t);
          const radius=100+(22+4*Math.sin(t*.97))*Math.cos(8*a+.13*wave)+5*Math.sin(3*a+t)+3*Math.cos(5*a-t);
          const angle=a+0.055*Math.sin(t);
          points.push([160+radius*Math.cos(angle)*(1+.035*Math.sin(t)),160+radius*Math.sin(angle)*(1-.025*Math.sin(t))]);
        }
        ctx.beginPath(); ctx.moveTo(points[0][0],points[0][1]);
        for(let i=1;i<n;i++) ctx.lineTo(points[i][0],points[i][1]);
        ctx.closePath(); ctx.fillStyle='#0b0c0b';ctx.fill();
      }
      reduced.addEventListener('change',()=>{state.playing=!reduced.matches;paint();});
      new ResizeObserver(paint).observe(canvas);
      new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;}).observe(canvas);
      function frame(now) {if(last!==null&&state.playing&&visible&&!document.hidden) elapsed+=Math.min(now-last,80);last=now;if(state.playing&&visible) paint();requestAnimationFrame(frame);}
      paint();requestAnimationFrame(frame);
    })();
