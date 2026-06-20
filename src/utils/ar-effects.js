export const registerCustomEffects = () => {
  if (typeof AFRAME === 'undefined') return;
  if (AFRAME.components['custom-particles']) return;

  const getPetalSvg = (color) => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path d="M128 0 C179.2 76.8, 230.4 179.2, 128 256 C25.6 179.2, 76.8 76.8, 128 0 Z" fill="${color}" opacity="0.8"/></svg>`)}`;
  const getLeafSvg = (color) => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path d="M128 0 Q230.4 102.4 128 256 Q25.6 102.4 128 0 Z" fill="${color}" opacity="0.9"/><path d="M128 0 L128 256" stroke="rgba(0,0,0,0.1)" stroke-width="5"/></svg>`)}`;
  const getSparkleSvg = (color) => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><path d="M128 0 Q128 128 256 128 Q128 128 128 256 Q128 128 0 128 Q128 128 128 0 Z" fill="${color}"/></svg>`)}`;
  const getSnowSvg = () => `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><defs><radialGradient id="snowGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" stop-color="white" stop-opacity="0.9" /><stop offset="50%" stop-color="white" stop-opacity="0.6" /><stop offset="100%" stop-color="white" stop-opacity="0" /></radialGradient></defs><circle cx="128" cy="128" r="102" fill="url(#snowGrad)"/></svg>`)}`;

  AFRAME.registerComponent('custom-particles', {
    schema: {
      type: { type: 'string', default: 'snow' },
      count: { type: 'number', default: 150 },
      size: { type: 'number', default: 0.1 },
      color: { type: 'string', default: '#ffffff' }
    },
    
    init: function () {
      this.particles = [];
      for (let i = 0; i < this.data.count; i++) {
        const particle = document.createElement('a-image');
        
        let typeStr = this.data.type;
        if (typeStr === 'snow') {
          particle.setAttribute('src', getSnowSvg());
          particle.setAttribute('width', this.data.size);
          particle.setAttribute('height', this.data.size);
          particle.setAttribute('material', 'transparent: true; side: double');
        } else if (typeStr === 'leaves' || typeStr === 'petals') {
          const colors = typeStr === 'petals' ? ['#ff99cc', '#ffccdd', '#ffb3c6', '#ff80ab'] : ['#8bc34a', '#ff9800', '#ffeb3b', '#4caf50'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          particle.setAttribute('src', typeStr === 'petals' ? getPetalSvg(color) : getLeafSvg(color));
          particle.setAttribute('width', this.data.size);
          particle.setAttribute('height', this.data.size * 1.2);
          particle.setAttribute('material', 'transparent: true; side: double');
        } else if (typeStr === 'sparkle' || typeStr === 'fireworks') {
          const colors = ['#ffd700', '#ffeb3b', '#ffc107', '#ff9800', '#ffffff'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          particle.setAttribute('src', getSparkleSvg(color));
          particle.setAttribute('width', this.data.size);
          particle.setAttribute('height', this.data.size);
          particle.setAttribute('material', 'transparent: true; side: double');

          // Add glowing halo behind core sparkle
          const halo = document.createElement('a-image');
          halo.setAttribute('src', getSparkleSvg(color));
          halo.setAttribute('width', this.data.size * 2.5);
          halo.setAttribute('height', this.data.size * 2.5);
          halo.setAttribute('position', '0 0 -0.01');
          halo.setAttribute('material', 'transparent: true; side: double; opacity: 0.3');
          particle.appendChild(halo);
        }

        const x = (Math.random() - 0.5) * 2;
        const y = (Math.random() - 0.5) * 2 + 1;
        const z = (Math.random() - 0.5) * 1;
        particle.setAttribute('position', `${x} ${y} ${z}`);
        
        const rx = Math.random() * 360;
        const ry = Math.random() * 360;
        const rz = Math.random() * 360;
        particle.setAttribute('rotation', `${rx} ${ry} ${rz}`);

        let dur = 3000 + Math.random() * 4000;
        let delay = Math.random() * 3000;

        if (typeStr === 'snow') {
          const swayX = x + (Math.random() - 0.5) * 0.8;
          particle.setAttribute('animation__pos', `property: position; from: ${x} ${y} ${z}; to: ${swayX} -1.5 ${z}; dur: ${dur}; loop: true; delay: ${delay}; easing: easeInQuad`);
          particle.setAttribute('animation__rot', `property: rotation; from: ${rx} ${ry} ${rz}; to: ${rx} ${ry+180} ${rz+180}; dur: ${dur}; loop: true; easing: linear`);
        } else if (typeStr === 'petals' || typeStr === 'leaves') {
          const swayX = x + (Math.random() - 0.5) * 1.5;
          const fallingEasing = typeStr === 'petals' ? 'easeInQuad' : 'linear';
          particle.setAttribute('animation__pos', `property: position; from: ${x} ${y} ${z}; to: ${swayX} -1.5 ${z}; dur: ${dur}; loop: true; delay: ${delay}; easing: ${fallingEasing}`);
          particle.setAttribute('animation__rot', `property: rotation; from: ${rx} ${ry} ${rz}; to: ${rx+360} ${ry+720} ${rz+360}; dur: ${dur*0.6}; loop: true; easing: linear`);
        } else if (typeStr === 'sparkle' || typeStr === 'fireworks') {
          particle.setAttribute('position', '0 0.5 0');
          const tx = (Math.random() - 0.5) * 3;
          const ty = (Math.random() - 0.5) * 3 + 0.5;
          const tz = (Math.random() - 0.5) * 2;
          particle.setAttribute('animation__pos', `property: position; from: 0 0.5 0; to: ${tx} ${ty} ${tz}; dur: ${dur*0.4}; loop: true; delay: ${delay}; easing: easeOutExpo`);
          particle.setAttribute('animation__scale', `property: scale; from: 1 1 1; to: 0 0 0; dur: ${dur*0.4}; loop: true; delay: ${delay}`);
        }

        this.el.appendChild(particle);
        this.particles.push(particle);
      }
    }
  });
};
